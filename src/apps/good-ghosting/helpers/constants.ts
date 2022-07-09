export enum NetworkId {
  EthereumMainnet = '1',
  Kovan = '42',
  PolygonMainnet = '137',
  PolygonMumbai = '80001',
  CeloMainnet = '42220',
  CeloAlfajores = '44787',
}

export type PlayerResponse = {
  gameId: string;
  playerId: string;
  withdrawn: boolean;
  isWaiting: boolean;
  interestAmount: string;
  incentiveAmount: string;
  paidAmount: string;
  isGameCompleted: string;
  rewardAmount: string;
  gameAPY: string;
  totalEarningsConverted: string;
  pooltotalEarningsConverted: string;
  isWinner: boolean;
  poolAPY: string;
};

export type PlayerBalance = {
  incentiveAmount: number;
  interestAmount: number;
  withdrawn: boolean;
  isWinner: boolean;
  paidAmount: number;
  rewardAmount: number;
  poolAPY: number;
  pooltotalEarningsConverted: number;
  playerId: string;
};

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

export const BASE_API_URL = 'https://goodghosting-api.com/v1';
