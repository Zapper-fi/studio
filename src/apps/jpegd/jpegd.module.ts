import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { JpegdContractFactory } from './contracts';
import { EthereumJpegdBalanceFetcher } from './ethereum/jpegd.balance-fetcher';
import { EthereumJpegdBondContractPositionFetcher } from './ethereum/jpegd.bond.contract-position-fetcher';
import { EthereumJpegdPoolContractPositionFetcher } from './ethereum/jpegd.pool.contract-position-fetcher';
import JPEGD_DEFINITION, { JpegdAppDefinition } from './jpegd.definition';

@Register.AppModule({
  appId: JPEGD_DEFINITION.id,
  imports: [OlympusAppModule],
  providers: [
    JpegdAppDefinition,
    JpegdContractFactory,
    EthereumJpegdBalanceFetcher,
    EthereumJpegdPoolContractPositionFetcher,
    EthereumJpegdBondContractPositionFetcher,
  ],
})
export class JpegdAppModule extends AbstractApp() {}
