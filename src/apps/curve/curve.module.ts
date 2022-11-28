import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CurveVolumeDataLoader } from './common/curve.volume.data-loader';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { ETHEREUM_CURVE_PROVIDERS } from './ethereum';
import { CurvePoolOnChainCoinStrategy } from './helpers/curve.pool.on-chain.coin-strategy';
import { CurvePoolOnChainReserveStrategy } from './helpers/curve.pool.on-chain.reserve-strategy';
import { CurvePoolTokenHelper } from './helpers/curve.pool.token-helper';
import { CurvePoolVirtualPriceStrategy } from './helpers/curve.pool.virtual.price-strategy';
import { CurveVotingEscrowContractPositionBalanceHelper } from './helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from './helpers/curve.voting-escrow.contract-position-helper';

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    CurveVolumeDataLoader,
    // Providers by Network
    // ...ARBITRUM_CURVE_PROVIDERS,
    // ...AVALANCHE_CURVE_PROVIDERS,
    // ...FANTOM_CURVE_PROVIDERS,
    ...ETHEREUM_CURVE_PROVIDERS,
    // ...GNOSIS_CURVE_PROVIDERS,
    // ...OPTIMISM_CURVE_PROVIDERS,
    // ...POLYGON_CURVE_PROVIDERS,
    // Legacy Helpers
    CurvePoolTokenHelper,
    CurvePoolVirtualPriceStrategy,
    CurvePoolOnChainCoinStrategy,
    CurvePoolOnChainReserveStrategy,
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
  ],
  exports: [
    CurveAppDefinition,
    CurveContractFactory,
    // Legacy Helpers
    CurvePoolTokenHelper,
    CurvePoolVirtualPriceStrategy,
    CurvePoolOnChainCoinStrategy,
    CurvePoolOnChainReserveStrategy,
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
  ],
})
export class CurveAppModule extends AbstractApp() {}
