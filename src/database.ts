import { open, Database } from "sqlite"

const sqlite3 = require("sqlite3");

async function createDatabase(): Promise<Database> {
    const database = await open({
        filename: "./quotes.db",
        driver: sqlite3.Database
    });

    await database.exec(`
         CREATE TABLE IF NOT EXISTS quotes (
            quoteId TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            principal REAL NOT NULL,
            leverage REAL NOT NULL,
            durationHours INTEGER NOT NULL,
            risk REAL NOT NULL,
            payoutCap REAL NOT NULL,
            premium REAL NOT NULL,
            createdAt TEXT NOT NULL
         );
        `);

    return database;
}

export default createDatabase;