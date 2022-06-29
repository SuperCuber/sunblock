import SunCalc from "suncalc"
import { DB } from "./transportation.js"

export async function getRoutes(req, res) {
    let data = DB.prepare("SELECT * FROM routes").all()
    data = data.map(route => {
        var [from, to] = route.route_long_name.split("<->")
        to = to.replace(/-.+$/, "")
        return { ...route, route_long_name: { from, to } }
    })
    res.json(data)
}

export async function optimizeRoute(req, res) {
    let route_id = req.params.route
    let shape_id = DB.prepare(`
        SELECT trips.*
        FROM trips
        WHERE trips.route_id == ?
    `).get(route_id).shape_id // just get one
    let shape = DB.prepare(`
        SELECT shape_pt_lat as lat, shape_pt_lon as lng
        FROM shapes
        WHERE shapes.shape_id == ?
        ORDER BY shape_pt_sequence ASC
    `).all(shape_id)

    let { lat, lng } = shape[0]

    // azimuth is from south clockwise:
    // azimuth=0 means south, azimuth=PI/2 means west
    let { altitude, azimuth } = SunCalc.getPosition(new Date(), lat, lng)
    // Translate to regular theta (from east anti clockwise)
    azimuth = -Math.PI / 2 - azimuth

    for (var i = 1; i < shape.length; i++) {
        let a = shape[i - 1]
        let b = shape[i]
        let direction_vec = [b.lng - a.lng, b.lat - a.lat]
        // Angle between direction_vec and east
        let direction_theta = Math.acos(
            direction_vec[0]
            / Math.sqrt(direction_vec[0] * direction_vec[0]
                + direction_vec[1] * direction_vec[1]
            )
        )
        if (direction_vec[1] < 0) {
            // In case of south, convert clockwise angle to anticlockwise "big" angle
            direction_theta = 2 * Math.PI - direction_theta
        }

        let angle_with_sun = direction_theta - azimuth
        if (angle_with_sun > 2 * Math.PI) {
            angle_with_sun -= 2 * Math.PI
        }

        shape[i].sunOnLeft = angle_with_sun > Math.PI
    }

    let parts = {left: [], right: []}
    let currentLeft = shape[1].sunOnLeft
    let currentPart = [shape[0]]
    for (var i = 1; i < shape.length; i++) {
        if (shape[i].sunOnLeft == currentLeft) {
            currentPart.push({lat: shape[i].lat, lng: shape[i].lng})
        } else {
            parts[currentLeft ? "left" : "right"].push(currentPart)
            currentPart = [currentPart[currentPart.length - 1]]
            currentLeft = shape[i].sunOnLeft
        }
    }

    res.json({ altitude, azimuth, parts })
}
