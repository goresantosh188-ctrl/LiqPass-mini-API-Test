import { describe, it, expect } from "vitest";
import request from "supertest";    
import app from "../src/server";

describe("POST /quote", () => {
    it("should create a valid quote", async () => {
        const response = await request(app).post("/quote").send({
            userId: "finnify",
            principal: 3200,
            leverage: 40,
            durationHours: 24
        });
        expect(response.status).toBe(200);
        expect(response.body.quoteId).toBeDefined();
    });

    it("should reject invalid input", async () => {
        const response = await request(app).post("/quote").send({
            userId: "Aleriado",
            principal: -50,
            leverage: 10,
            durationHours: 8
        });
        expect(response.status).toBe(400);
    });
});

describe("GET /quotes/:userId", () => {
    it("should return quotes for user", async () => {
        const response = await request(app).get("/quotes/finnify")
        expect(response.status).toBe(200);
        expect(response.body.userId).toBe("finnify");
    })
})