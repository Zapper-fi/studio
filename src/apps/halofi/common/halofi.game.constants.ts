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

type RewardBalance = {
  tokenId: string;
  address: string;
  type: string;
  balance: string;
  convertedBalance: string;
};

type Reward = {
  tokenId: string;
  address: string;
  type: string;
};

export const transformRewardArrayToObject = (rewards: RewardBalance[]) => {
  const playerReward: Record<string, RewardBalance> = {};
  rewards.forEach(reward => {
    const { type } = reward;
    playerReward[type] = reward;
  });
  return playerReward;
};

const ContractVersions = ['2.0.0', '2.0.1', '2.0.2', '2.0.3', '2.0.4'];

export const getGameVersionType = (contractVersion: string) => {
  if (ContractVersions.includes(contractVersion)) {
    return true;
  }
  const [derivedContractVersion] = contractVersion.split('-');
  if (ContractVersions.includes(derivedContractVersion)) {
    return true;
  }
  return false;
};

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
  rewards?: RewardBalance[];
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
    gameNameShort: string;
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
    rewards?: Reward[];
  }
>;

export const BASE_API_URL = 'https://goodghosting-api.com/v1';
