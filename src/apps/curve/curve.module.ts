import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ARBITRUM_CURVE_PROVIDERS } from './arbitrum';
import { AVALANCHE_CURVE_PROVIDERS } from './avalanche';
import { CurveVolumeDataLoader } from './common/curve.volume.data-loader';
import { CurveContractFactory } from './contracts';
import { CurveAppDefinition, CURVE_DEFINITION } from './curve.definition';
import { ETHEREUM_CURVE_PROVIDERS } from './ethereum';
import { FANTOM_CURVE_PROVIDERS } from './fantom';
import { GNOSIS_CURVE_PROVIDERS } from './gnosis';
import { CurveVotingEscrowContractPositionBalanceHelper } from './helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from './helpers/curve.voting-escrow.contract-position-helper';
import { OPTIMISM_CURVE_PROVIDERS } from './optimism';
import { POLYGON_CURVE_PROVIDERS } from './polygon';

@Register.AppModule({
  appId: CURVE_DEFINITION.id,
  providers: [
    CurveAppDefinition,
    CurveContractFactory,
    CurveVolumeDataLoader,
    // Providers by Network
    ...ARBITRUM_CURVE_PROVIDERS,
    ...AVALANCHE_CURVE_PROVIDERS,
    ...FANTOM_CURVE_PROVIDERS,
    ...ETHEREUM_CURVE_PROVIDERS,
    ...GNOSIS_CURVE_PROVIDERS,
    ...OPTIMISM_CURVE_PROVIDERS,
    ...POLYGON_CURVE_PROVIDERS,
    // Legacy Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
  ],
  exports: [
    CurveAppDefinition,
    CurveContractFactory,
    // Legacy Helpers
    CurveVotingEscrowContractPositionHelper,
    CurveVotingEscrowContractPositionBalanceHelper,
  ],
})
export class CurveAppModule extends AbstractApp() {}
