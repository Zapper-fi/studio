import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LlamapayStreamApiClient } from './common/llamapay.stream.api-client';
import { LlamapayContractFactory } from './contracts';
import { EthereumLlamapayStreamContractPositionFetcher } from './ethereum/llamapay.stream.contract-position-fetcher';
import { EthereumLlamapayVestingEscrowContractPositionFetcher } from './ethereum/llamapay.vesting-escrow.contract-position-fetcher';
import { LlamapayAppDefinition, LLAMAPAY_DEFINITION } from './llamapay.definition';

@Register.AppModule({
  appId: LLAMAPAY_DEFINITION.id,
  providers: [
    LlamapayAppDefinition,
    LlamapayContractFactory,
    LlamapayStreamApiClient,
    EthereumLlamapayStreamContractPositionFetcher,
    EthereumLlamapayVestingEscrowContractPositionFetcher,
  ],
})
export class LlamapayAppModule extends AbstractApp() {}
