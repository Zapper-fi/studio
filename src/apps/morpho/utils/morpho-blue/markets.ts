import { gql } from 'graphql-request';

export class MorphoBlueMarkets {
  static wstethWethChainlinkAdaptiveCurveIRM945 = '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41';
  static wstethUsdcChainlinkAdaptiveCurveIRM860 = '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc';
  static wbib01UsdcChainlinkAdaptiveCurveIRM965 = '0x495130878b7d2f1391e21589a8bcaef22cbc7e1fbbd6866127193b3cc239d8b1';
  static sdaiUsdcChainlinkAdaptiveCurveIRM965 = '0x06f2842602373d247c4934f7656e513955ccc4c377f0febc0d9ca2c3bcc191b1';
  static wethUsdcChainlinkAdaptiveCurveIRM915 = '0xf9acc677910cc17f650416a22e2a14d5da7ccb9626db18f1bf94efe64f92b372';
  static wethUsdcChainlinkAdaptiveCurveIRM860 = '0x7dde86a1e94561d9690ec678db673c1a6396365f7d1d65e129c5fff0990ff758';
  static wbtcUsdcChainlinkAdaptiveCurveIRM860 = '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49';

  static whitelistedIds = [
    MorphoBlueMarkets.wstethWethChainlinkAdaptiveCurveIRM945,
    MorphoBlueMarkets.wstethUsdcChainlinkAdaptiveCurveIRM860,
    MorphoBlueMarkets.wbib01UsdcChainlinkAdaptiveCurveIRM965,
    MorphoBlueMarkets.sdaiUsdcChainlinkAdaptiveCurveIRM965,
    MorphoBlueMarkets.wethUsdcChainlinkAdaptiveCurveIRM915,
    MorphoBlueMarkets.wethUsdcChainlinkAdaptiveCurveIRM860,
    MorphoBlueMarkets.wbtcUsdcChainlinkAdaptiveCurveIRM860,
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
