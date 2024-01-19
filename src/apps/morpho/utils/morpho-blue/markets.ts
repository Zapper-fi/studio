import { gql } from 'graphql-request';

export class MorphoBlueMarkets {
  static wstethWethChainlinkAdaptiveCurveIRM945 = '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41';
  static wstethUsdcChainlinkAdaptiveCurveIRM860 = '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc';
  static wbib01UsdcChainlinkAdaptiveCurveIRM965 = '0x495130878b7d2f1391e21589a8bcaef22cbc7e1fbbd6866127193b3cc239d8b1';

  static whitelistedIds = [
    MorphoBlueMarkets.wstethWethChainlinkAdaptiveCurveIRM945,
    MorphoBlueMarkets.wstethUsdcChainlinkAdaptiveCurveIRM860,
    MorphoBlueMarkets.wbib01UsdcChainlinkAdaptiveCurveIRM965,
  ];

  static MARKET_COLLATERAL_QUERY = gql`
    query getWhitelistedMarkets($ids: [ID!]) {
      markets(where: { id_in: $ids }) {
        id
        inputTokenPriceUSD
        totalCollateral
      }
    }
  `;
}

export type MarketCollateralResponse = {
  markets: {
    id: string;
    inputTokenPriceUSD: string;
    totalCollateral: string;
  }[];
};
