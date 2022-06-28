import express from "express"
import {pog} from "./routes.js"

const app = express()

app.use(express.json({limit: "50mb"}))
app.get("/pog", pog)
app.listen(3001, () => {
    console.log("pog")
})
