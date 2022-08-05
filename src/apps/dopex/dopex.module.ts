import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { SynthetixAppModule } from '~apps/synthetix';

import { ArbitrumDopexBalanceFetcher } from './arbitrum/dopex.balance-fetcher';
import { ArbitrumDopexDpxSsovContractPositionFetcher } from './arbitrum/dopex.dpx-ssov.contract-position-fetcher';
import { ArbitrumDopexEthSsovContractPositionFetcher } from './arbitrum/dopex.eth-ssov.contract-position-fetcher';
import { ArbitrumDopexFarmContractPositionFetcher } from './arbitrum/dopex.farm.contract-position-fetcher';
import { ArbitrumDopexGmxSsovContractPositionFetcher } from './arbitrum/dopex.gmx-ssov.contract-position-fetcher';
import { ArbitrumDopexGOhmSsovContractPositionFetcher } from './arbitrum/dopex.gohm-ssov.contract-position-fetcher';
import { ArbitrumDopexRdpxSsovContractPositionFetcher } from './arbitrum/dopex.rdpx-ssov.contract-position-fetcher';
import { ArbitrumDopexVotingEscrowContractPositionFetcher } from './arbitrum/dopex.voting-escrow.contract-position-fetcher';
import { DopexContractFactory } from './contracts';
import { DopexAppDefinition, DOPEX_DEFINITION } from './dopex.definition';
import { DopexDualRewardFarmRoiStrategy } from './helpers/dopex.dual-reward-farm.roi-strategy';
import { DopexSsovClaimableBalancesStrategy } from './helpers/dopex.ssov.claimable-balances-strategy';
import { DopexSsovContractPositionBalanceHelper } from './helpers/dopex.ssov.contract-position-balance-helper';
import { DopexSsovContractPositionHelper } from './helpers/dopex.ssov.contract-position-helper';
import { DopexSsovDepositBalanceStrategy } from './helpers/dopex.ssov.deposit-balance-strategy';

@Register.AppModule({
  appId: DOPEX_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    DopexAppDefinition,
    DopexContractFactory,
    DopexDualRewardFarmRoiStrategy,
    DopexSsovClaimableBalancesStrategy,
    DopexSsovContractPositionBalanceHelper,
    DopexSsovContractPositionHelper,
    DopexSsovDepositBalanceStrategy,
    ArbitrumDopexBalanceFetcher,
    ArbitrumDopexDpxSsovContractPositionFetcher,
    ArbitrumDopexRdpxSsovContractPositionFetcher,
    ArbitrumDopexEthSsovContractPositionFetcher,
    ArbitrumDopexFarmContractPositionFetcher,
    ArbitrumDopexGmxSsovContractPositionFetcher,
    ArbitrumDopexGOhmSsovContractPositionFetcher,
    ArbitrumDopexVotingEscrowContractPositionFetcher,
    // External Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
  ],
})
export class DopexAppModule extends AbstractApp() {}
