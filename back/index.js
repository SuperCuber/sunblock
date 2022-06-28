import express from "express"
import { pog } from "./routes.js"
import { downloadIfNeeded } from "./transportation.js"

async function main() {
    await downloadIfNeeded()
    const app = express()

    app.use(express.json({limit: "50mb"}))
    app.get("/pog", pog)
    app.listen(3001)
}

main()
