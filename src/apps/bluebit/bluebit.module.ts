import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { AuroraBluebitBalanceFetcher } from './aurora/bluebit.balance-fetcher';
import { AuroraBluebitFarmContractPositionFetcher } from './aurora/bluebit.farm.contract-position-fetcher';
import { AuroraBluebitVotingEscrowContractPositionFetcher } from './aurora/bluebit.voting-escrow.contract-position-fetcher';
import { BluebitAppDefinition, BLUEBIT_DEFINITION } from './bluebit.definition';
import { BluebitContractFactory } from './contracts';

@Register.AppModule({
  appId: BLUEBIT_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    BluebitAppDefinition,
    BluebitContractFactory,
    // External Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
    // Aurora
    AuroraBluebitBalanceFetcher,
    AuroraBluebitFarmContractPositionFetcher,
    AuroraBluebitVotingEscrowContractPositionFetcher,
  ],
})
export class BluebitAppModule extends AbstractApp() {}
