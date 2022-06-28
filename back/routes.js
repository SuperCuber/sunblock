import SunCalc from "suncalc"
import { DB } from "./transportation.js"

export async function getRoutes(req, res) {
    let data = DB.prepare("SELECT * FROM routes").all()
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
    // Translate to regular theta
    azimuth = -Math.PI / 2 - azimuth

    for (var i = 1; i < shape.length; i++) {
        let a = shape[i - 1]
        let b = shape[i]
        let direction_vec = [b.lng - a.lng, b.lat - a.lat]
        // Angle between direction_vec and east
        let direction_theta_rad = Math.acos(
            direction_vec[0]
            / Math.sqrt(direction_vec[0] * direction_vec[0]
                + direction_vec[1] * direction_vec[1]
            )
        )
        if (direction_vec[1] < 0) {
            // ??? this fixes it?
            direction_theta_rad *= -1
        }
        let direction_theta_deg = direction_theta_rad * 180 / Math.PI
        shape[i].direction = direction_theta_deg
    }

    res.json({ altitude, azimuth, shape })
}
