export enum NetworkId {
  EthereumMainnet = '1',
  Kovan = '42',
  PolygonMainnet = '137',
  PolygonMumbai = '80001',
  CeloMainnet = '42220',
  CeloAlfajores = '44787',
}

export enum RewardType {
  Reward = 'reward',
  Incentive = 'incentive',
  Deposit = 'deposit',
}

enum ContractVersions {
  V200 = '2.0.0',
  V001 = '0.0.1',
  v002 = '0.0.2',
  v003 = '0.0.3',
}

type Reward = {
  tokenId: string;
  address: string;
  type: string;
  balance: string;
  convertedBalance: string;
};

export const transformRewardArrayToObject = (rewards: Reward[]) => {
  const playerReward: Record<string, Reward> = {};
  rewards.map(reward => {
    const { type } = reward;
    playerReward[type] = reward;
  });

  return playerReward;
};

export const getGameVersionType = (contractVersion: string) => contractVersion === ContractVersions.V200;

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
