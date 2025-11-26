export type CreateQuoteReq = Request & {
    body: {
        userId: string;
        principal: number;
        leverage: number;
        durationHours: number;
    };
};
export type QuoteJSONResponse = {
    quoteId: string;
    userId: string;
    principal: number;
    leverage: number;
    durationHours: number;
    risk: number;
    payoutCap: number;
    premium: number;
    createdAt: string;
};
export type GetUserQuotesJSONResponse = {
    userId: string;
    quotes: Array<QuoteJSONResponse>;
};
//# sourceMappingURL=server-types.d.ts.map