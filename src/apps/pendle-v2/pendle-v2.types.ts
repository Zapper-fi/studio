export type TokenResponse = {
    price: {
        usd: number;
    }
};
export type MarketResponse = {
    address: string;
    symbol: string;
    aggregatedApy: number;
    proName: string;
    proIcon: string;
    reserves: {
        totalPt: number;
        totalSy: number;
    }
    sy: TokenResponse;
    pt: TokenResponse;
    lp: TokenResponse;
}
export type MarketsQueryResponse = {
    markets: {
        results: MarketResponse[];
    }
}
