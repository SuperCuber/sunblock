import ftp from "basic-ftp"
import unzipper from "unzipper"
import fs from "fs"

const TRANSPORTATION_ZIP = "israel-public-transportation.zip"
const TRANSPORTATION_LOCAL_ZIP = `transportation/${TRANSPORTATION_ZIP}`
const REQUIRED_FILES = ["trips.txt", "routes.txt", "shapes.txt"]

export async function downloadIfNeeded() {
    if (!fs.existsSync(TRANSPORTATION_LOCAL_ZIP)) {
        console.log("Downloading transportation.zip ...")
        const client = new ftp.Client()
        await client.access({
            host: "gtfs.mot.gov.il",
            secure: false,
        })
        await client.downloadTo(TRANSPORTATION_LOCAL_ZIP, TRANSPORTATION_ZIP)
        console.log("Downloaded transportation.zip")
    }

    if (!REQUIRED_FILES.every(f => fs.existsSync(`transportation/${f}`))) {
        console.log("Extracting...")
        const zip = fs.createReadStream(TRANSPORTATION_LOCAL_ZIP).pipe(unzipper.Parse({ forceStream: true }))
        for await (const entry of zip) {
            if (REQUIRED_FILES.includes(entry.path)) {
                console.log(`Extracting ${entry.path}...`)
                entry.pipe(fs.createWriteStream(`transportation/${entry.path}`))
            } else {
                entry.autodrain()
            }
        }
        console.log("Extracted.")
    }
}
