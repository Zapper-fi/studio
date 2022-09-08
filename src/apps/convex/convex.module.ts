import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConvexContractFactory } from './contracts';
import { ConvexAppDefinition, CONVEX_DEFINITION } from './convex.definition';
import { EthereumConvexAbracadabraClaimableContractPositionFetcher } from './ethereum/convex.abracadabra-claimable.contract-position-fetcher';
import { EthereumConvexBoosterContractPositionFetcher } from './ethereum/convex.booster.contract-position-fetcher';
import { EthereumConvexCvxCrvStakingContractPositionFetcher } from './ethereum/convex.cvx-crv-staking.contract-position-fetcher';
import { EthereumConvexCvxStakingContractPositionFetcher } from './ethereum/convex.cvx-staking.contract-position-fetcher';
import { EthereumConvexDepositTokenFetcher } from './ethereum/convex.deposit.token-fetcher';
import { EthereumConvexDepositorContractPositionFetcher } from './ethereum/convex.depositor.contract-position-fetcher';
import { EthereumConvexLpFarmContractPositionFetcher } from './ethereum/convex.lp-farm.contract-position-fetcher';
import { EthereumConvexVotingEscrowContractPositionFetcher } from './ethereum/convex.voting-escrow.contract-position-fetcher';

@Register.AppModule({
  appId: CONVEX_DEFINITION.id,
  providers: [
    ConvexAppDefinition,
    ConvexContractFactory,
    // Ethereum
    EthereumConvexDepositorContractPositionFetcher,
    EthereumConvexBoosterContractPositionFetcher,
    EthereumConvexAbracadabraClaimableContractPositionFetcher,
    EthereumConvexDepositTokenFetcher,
    EthereumConvexCvxStakingContractPositionFetcher,
    EthereumConvexCvxCrvStakingContractPositionFetcher,
    EthereumConvexLpFarmContractPositionFetcher,
    EthereumConvexVotingEscrowContractPositionFetcher,
  ],
})
export class ConvexAppModule extends AbstractApp() {}
