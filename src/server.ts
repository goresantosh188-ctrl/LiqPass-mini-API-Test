import { Request, Response } from "express";
import { CreateQuoteReq, QuoteJSONResponse, GetUserQuotesJSONResponse } from "./server-types";
import { v4 as uuidv4 } from "uuid";
import createDatabase from "./database";

const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const port: number = 8080;

app.use(express.json())

let database: any;
(async (): Promise<void> => {
    database = await createDatabase();
})()

app.post("/quote", async (req: CreateQuoteReq, res: Response): Promise<void> => {
    const userId = req.body?.userId ?? "Invalid";
    const principal = req.body?.principal < 0 
                        ? "Invalid" 
                        : req.body?.principal ?? "Invalid";
    const leverage = req.body?.leverage < 1 || req.body?.leverage > 150 
                        ? "Invalid" 
                        : req.body?.leverage ?? "Invalid";  
    const durationHours: number | "Invalid" = ![8, 24, 168].includes(req.body?.durationHours) 
                        ? "Invalid" : req.body?.durationHours ?? "Invalid";

    if (userId === "Invalid" || principal === "Invalid" || leverage === "Invalid" || 
        durationHours === "Invalid") {
        res.status(400).json({ message: `Invalid input was given. \n${req.body}` });
        return;
    }

    const risk = Math.min(0.99, leverage / 120);
    const payoutCap = (principal * durationHours) / 3;
    const premium = principal * risk * durationHours / 100;
    const quoteId = uuidv4();
    const now = new Date();
    const createdAt = now.toISOString()

    await database.run(
        `
        INSERT INTO quotes 
        (quoteId, userId, principal, leverage, durationHours, risk, payoutCap, premium, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        quoteId,
        userId,
        principal,
        leverage,
        durationHours,
        risk,
        payoutCap,
        premium,
        createdAt
    )

    const JSONMessage: QuoteJSONResponse = {
        quoteId: quoteId,
        userId: userId,
        principal: principal,
        leverage: leverage,
        durationHours: durationHours,
        risk: risk,
        payoutCap: payoutCap,
        premium: premium,
        createdAt: createdAt
    }

    res.json(JSONMessage);
})

app.get("/quotes/:userId", async (req: Request, res: Response): Promise<void> => {
    const userId = req.params?.userId ?? "Invalid"
    if (userId === "Invalid") {
        res.status(400).send(`Invalid user id param. Please enter a valid user id. `);
        return;
    }

    const rows = await database.all(
        `SELECT * FROM quotes WHERE userId = ? ORDER BY createdAt DESC`,
        userId
    )

    const JSONMessage: GetUserQuotesJSONResponse = {
        userId: userId,
        quotes: rows
    }

    res.json(JSONMessage);
})

if (process.env.NODE_ENV !== "test") {
    app.listen(port, (): void => {
        console.log(`App listening on port ${port}`);
    })
}

export default app;