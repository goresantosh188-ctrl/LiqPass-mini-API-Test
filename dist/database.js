"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
const sqlite3 = require("sqlite3");
async function createDatabase() {
    const database = await (0, sqlite_1.open)({
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
exports.default = createDatabase;
//# sourceMappingURL=database.js.map