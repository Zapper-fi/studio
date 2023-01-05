import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { JpegdContractFactory } from './contracts';
import { EthereumJpegdBondContractPositionFetcher } from './ethereum/jpegd.bond.contract-position-fetcher';
import { EthereumJpegdChefV1ContractPositionFetcher } from './ethereum/jpegd.chef-v1.contract-position-fetcher';
import { EthereumJpegdChefV2ContractPositionFetcher } from './ethereum/jpegd.chef-v2.contract-position-fetcher';
import { JpegdAppDefinition, JPEGD_DEFINITION } from './jpegd.definition';

@Register.AppModule({
  appId: JPEGD_DEFINITION.id,
  providers: [
    JpegdAppDefinition,
    JpegdContractFactory,
    EthereumJpegdChefV1ContractPositionFetcher,
    EthereumJpegdChefV2ContractPositionFetcher,
    EthereumJpegdBondContractPositionFetcher,
  ],
})
export class JpegdAppModule extends AbstractApp() {}
