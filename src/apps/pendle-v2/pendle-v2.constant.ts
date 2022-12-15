import { gql } from 'graphql-request';

export const PENDLE_V2_GRAPHQL_ENDPOINT = 'https://api-v2.pendle.finance/core/graphql';
export const BACKEND_QUERIES = {
    getMarkets: gql`
        query getMarket($chainId: Int!) {
            markets(chainId: $chainId, where: { isWhitelistedPro: true }) {
                results {
                    address
                    aggregatedApy
                    ytFloatingApy
                    proName
                    proIcon
                    expiry
                    sy {
                        address
                        proName
                        proIcon
                        price {
                            usd
                        }
                    }
                    pt {
                        address
                        proName
                        proIcon
                        price {
                            usd
                        }
                    }
                    yt {
                        address
                        proName
                        proIcon
                        price {
                            usd
                        }
                    }
                    lp {
                        price {
                            usd
                        }
                    }
                }
            }
        }
    `,
}
