import { DB } from "./transportation.js"

export async function getRoutes(req, res) {
    let search = req.params.search
    let data = DB.prepare(`
        SELECT routes.*, agency.agency_name
        FROM routes
        LEFT JOIN agency ON agency.agency_id == routes.agency_id
        WHERE routes.route_short_name == ?
    `).all(search)
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

    res.json(shape)
}
