"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("./database"));
const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const port = 8080;
app.use(express.json());
let database;
(async () => {
    database = await (0, database_1.default)();
})();
app.post("/quote", async (req, res) => {
    const userId = req.body?.userId ?? "Invalid";
    const principal = req.body?.principal < 0
        ? "Invalid"
        : req.body?.principal ?? "Invalid";
    const leverage = req.body?.leverage < 1 || req.body?.leverage > 150
        ? "Invalid"
        : req.body?.leverage ?? "Invalid";
    const durationHours = ![8, 24, 168].includes(req.body?.durationHours)
        ? "Invalid" : req.body?.durationHours ?? "Invalid";
    if (userId === "Invalid" || principal === "Invalid" || leverage === "Invalid" ||
        durationHours === "Invalid") {
        res.status(400).json({ message: `Invalid input was given. \n${req.body}` });
        return;
    }
    const risk = Math.min(0.99, leverage / 120);
    const payoutCap = (principal * durationHours) / 3;
    const premium = principal * risk * durationHours / 100;
    const quoteId = (0, uuid_1.v4)();
    const now = new Date();
    const createdAt = now.toISOString();
    await database.run(`
        INSERT INTO quotes 
        (quoteId, userId, principal, leverage, durationHours, risk, payoutCap, premium, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, quoteId, userId, principal, leverage, durationHours, risk, payoutCap, premium, createdAt);
    const JSONMessage = {
        quoteId: quoteId,
        userId: userId,
        principal: principal,
        leverage: leverage,
        durationHours: durationHours,
        risk: risk,
        payoutCap: payoutCap,
        premium: premium,
        createdAt: createdAt
    };
    res.json(JSONMessage);
});
app.get("/quotes/:userId", async (req, res) => {
    const userId = req.params?.userId ?? "Invalid";
    if (userId === "Invalid") {
        res.status(400).send(`Invalid user id param. Please enter a valid user id. `);
        return;
    }
    const rows = await database.all(`SELECT * FROM quotes WHERE userId = ? ORDER BY createdAt DESC`, userId);
    const JSONMessage = {
        userId: userId,
        quotes: rows
    };
    res.json(JSONMessage);
});
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map