import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { JpegdContractFactory } from './contracts';
import { EthereumJpegdBondContractPositionFetcher } from './ethereum/jpegd.bond.contract-position-fetcher';
import { EthereumJpegdPoolContractPositionFetcher } from './ethereum/jpegd.pool.contract-position-fetcher';
import { JpegdAppDefinition, JPEGD_DEFINITION } from './jpegd.definition';

@Register.AppModule({
  appId: JPEGD_DEFINITION.id,
  providers: [
    JpegdAppDefinition,
    JpegdContractFactory,
    EthereumJpegdPoolContractPositionFetcher,
    EthereumJpegdBondContractPositionFetcher,
  ],
})
export class JpegdAppModule extends AbstractApp() {}
