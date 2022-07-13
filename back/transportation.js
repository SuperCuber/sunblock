import fs from "fs"

import ftp from "basic-ftp"
import unzipper from "unzipper"
import Database from "better-sqlite3"
import Papa from "papaparse"

const TRANSPORTATION_ZIP = "israel-public-transportation.zip"
export const TRANSPORTATION_FOLDER = "transportation"
const TRANSPORTATION_LOCAL_ZIP = `${TRANSPORTATION_FOLDER}/${TRANSPORTATION_ZIP}`
const REQUIRED_FILES = ["trips.txt", "routes.txt", "shapes.txt", "agency.txt"]
const DB_FILE = `${TRANSPORTATION_FOLDER}/transportation.sqlite3`

export var DB = undefined;

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

    if (!REQUIRED_FILES.every(f => fs.existsSync(`${TRANSPORTATION_FOLDER}/${f}`))) {
        console.log("Extracting...")
        const zip = fs.createReadStream(TRANSPORTATION_LOCAL_ZIP).pipe(unzipper.Parse({ forceStream: true }))
        for await (const entry of zip) {
            if (REQUIRED_FILES.includes(entry.path)) {
                console.log(`Extracting ${entry.path}...`)
                entry.pipe(fs.createWriteStream(`${TRANSPORTATION_FOLDER}/${entry.path}`))
            } else {
                entry.autodrain()
            }
        }
        console.log("Extracted.")
    }

    if (!fs.existsSync(DB_FILE)) {
        console.log("Creating database...")
        await createDb()
        console.log("Created database")
    }

    DB = new Database(DB_FILE)
}

async function createDb() {
    const db = new Database(DB_FILE)
    db.pragma('journal_mode = WAL')

    db.prepare(
        `create table agency(
            agency_id integer not null,
            agency_name text not null,
            agency_url text not null,
            agency_timezone text not null,
            agency_lang text not null,
            agency_phone text not null,
            agency_fare_url text not null
        );
    `).run()
    await insertTable(
        db,
        "agency",
        ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url"]
    )

    db.prepare(
        `create table routes(
            route_id integer not null,
            agency_id integer not null,
            route_short_name text not null,
            route_long_name text not null,
            route_desc text not null,
            route_type integer not null,
            route_color text not null
        );
    `).run()
    await insertTable(
        db,
        "routes",
        ["route_id", "agency_id", "route_short_name", "route_long_name", "route_desc", "route_type", "route_color"],
    )

    db.prepare(
        `create table trips(
            route_id integer not null,
            service_id integer not null,
            trip_id text not null,
            trip_headsign text not null,
            direction_id integer not null,
            shape_id integer not null
        );
    `).run()
    await insertTable(
        db,
        "trips",
        ["route_id", "service_id", "trip_id", "trip_headsign", "direction_id", "shape_id"],
    )

    db.prepare(
        `create table shapes(
            shape_id integer not null,
            shape_pt_lat real not null,
            shape_pt_lon real not null,
            shape_pt_sequence integer not null
        );
    `).run()
    await insertTable(
        db,
        "shapes",
        ["shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence"],
    )

    return new Promise(resolve => {
        db.close(resolve)
    })
}

async function insertTable(db, name, columns) {
    console.log(`Inserting into ${name}...`)
    let insert = db.prepare(`
        insert into ${name}(${columns.join(",")})
        values(${columns.map(c => "$" + c).join(",")});
    `)
    await readCsv(name, row => {
        insert.run(row)
    })
}

async function readCsv(name, onRow) {
    let stream = fs
        .createReadStream(`${TRANSPORTATION_FOLDER}/${name}.txt`, { start: 3 })
        .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, { header: true, }))
    stream.on('data', onRow)
    return new Promise(resolve => {
        stream.on('end', () => resolve())
    })
}
