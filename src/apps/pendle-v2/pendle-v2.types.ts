export type TokenResponse = {
    address: string;
    proName: string;
    proIcon: string;
    price: {
        usd: number;
    }
};
export type MarketResponse = {
    address: string;
    aggregatedApy: number;
    ytFloatingApy: number;
    proName: string;
    proIcon: string;
    expiry: string;
    sy: TokenResponse;
    pt: TokenResponse;
    yt: TokenResponse;
    lp: {
        price: {
            usd: number;
        }
    };
}
export type MarketsQueryResponse = {
    markets: {
        results: MarketResponse[];
    }
}
