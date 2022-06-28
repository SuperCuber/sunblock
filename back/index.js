import express from "express"
import { getRoutes, optimizeRoute } from "./routes.js"
import { downloadIfNeeded } from "./transportation.js"

async function main() {
    await downloadIfNeeded()

    const app = express()
    app.use(express.json({limit: "50mb"}))

    app.get("/routes", getRoutes)
    app.get("/optimize/:route", optimizeRoute)

    app.listen(3001)
}

main()
