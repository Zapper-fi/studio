export enum ABIVersion {
  v001 = '0.0.1',
  v002 = '0.0.2',
  v003 = '0.0.3',
}

export enum NetworkId {
  EthereumMainnet = '1',
  Kovan = '42',
  PolygonMainnet = '137',
  PolygonMumbai = '80001',
  CeloMainnet = '42220',
  CeloAlfajores = '44787',
}

export type GamesResponse = Record<
  string,
  {
    displayId: number;
    networkId: string;
    depositToken: string;
    liquidityToken: string;
    rewardToken?: string;
    incentiveToken?: string;
    gameName: string;
    contractVersion: string;
    isCapped: boolean;
    strategyProvider: string;
    paymentAmount: string;
    isWhitelisted: boolean;
    ggScore: number;
    id: string;
    gameStartsAt: string;
    segmentLength: string;
    totalSegmentCount: string;
    paymentCount: string;
    depositTokenAddress: string;
    liquidityTokenAddress: string;
    rewardTokenAddress?: string;
    incentiveTokenAddress?: string;
    currentSegment: string;
    earlyWithdrawalFee: string;
    performanceFee: string;
  }
>;
