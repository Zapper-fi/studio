import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ARBITRUM_CURVE_PROVIDERS } from './arbitrum';
import { AVALANCHE_CURVE_PROVIDERS } from './avalanche';
import { BASE_CURVE_PROVIDERS } from './base';
import { CurveVolumeDataLoader } from './common/curve.volume.data-loader';
import { CurveViemContractFactory } from './contracts';
import { ETHEREUM_CURVE_PROVIDERS } from './ethereum';
import { FANTOM_CURVE_PROVIDERS } from './fantom';
import { GNOSIS_CURVE_PROVIDERS } from './gnosis';
import { OPTIMISM_CURVE_PROVIDERS } from './optimism';
import { POLYGON_CURVE_PROVIDERS } from './polygon';

@Module({
  providers: [
    CurveViemContractFactory,
    CurveVolumeDataLoader,
    // Providers by Network
    ...ARBITRUM_CURVE_PROVIDERS,
    ...AVALANCHE_CURVE_PROVIDERS,
    ...FANTOM_CURVE_PROVIDERS,
    ...ETHEREUM_CURVE_PROVIDERS,
    ...GNOSIS_CURVE_PROVIDERS,
    ...OPTIMISM_CURVE_PROVIDERS,
    ...POLYGON_CURVE_PROVIDERS,
    ...BASE_CURVE_PROVIDERS,
  ],
})
export class CurveAppModule extends AbstractApp() {}
