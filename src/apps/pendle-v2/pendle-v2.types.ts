export type TokenResponse = {
    address: string;
    price: {
        usd: number;
    }
};
export type MarketResponse = {
    address: string;
    aggregatedApy: number;
    proName: string;
    proIcon: string;
    expiry: string;
    sy: TokenResponse;
    pt: TokenResponse;
    lp: TokenResponse;
}
export type MarketsQueryResponse = {
    markets: {
        results: MarketResponse[];
    }
}
