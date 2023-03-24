import { EthereumConvexAbracadabraClaimableContractPositionFetcher } from './convex.abracadabra-claimable.contract-position-fetcher';
import { EthereumConvexBoosterContractPositionFetcher } from './convex.booster.contract-position-fetcher';
import { EthereumConvexCvxCrvStakingWrappedContractPositionFetcher } from './convex.cvx-crv-staking-wrapped.contract-position-fetcher';
import { EthereumConvexCvxCrvStakingContractPositionFetcher } from './convex.cvx-crv-staking.contract-position-fetcher';
import { EthereumConvexCvxStakingContractPositionFetcher } from './convex.cvx-staking.contract-position-fetcher';
import { EthereumConvexDepositTokenFetcher } from './convex.deposit.token-fetcher';
import { EthereumConvexDepositorContractPositionFetcher } from './convex.depositor.contract-position-fetcher';
import { EthereumConvexLpFarmContractPositionFetcher } from './convex.lp-farm.contract-position-fetcher';
import { EthereumConvexStashTokenWrappedTokenFetcher } from './convex.stash-token-wrapped.token-fetcher';
import { EthereumConvexVotingEscrowContractPositionFetcher } from './convex.voting-escrow.contract-position-fetcher';

export const CONVEX_ETHEREUM_PROVIDERS = [
  EthereumConvexDepositorContractPositionFetcher,
  EthereumConvexBoosterContractPositionFetcher,
  EthereumConvexAbracadabraClaimableContractPositionFetcher,
  EthereumConvexDepositTokenFetcher,
  EthereumConvexCvxStakingContractPositionFetcher,
  EthereumConvexCvxCrvStakingContractPositionFetcher,
  EthereumConvexLpFarmContractPositionFetcher,
  EthereumConvexVotingEscrowContractPositionFetcher,
  EthereumConvexCvxCrvStakingWrappedContractPositionFetcher,
  EthereumConvexStashTokenWrappedTokenFetcher,
];
