import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumTenderizeSwapTokenFetcher } from './arbitrum/tenderize.swap.token-fetcher';
import { ArbitrumTenderizeTenderTokenFetcher } from './arbitrum/tenderize.tender.tender.token-fetcher';
import { TenderizeTokenDefinitionsResolver } from './common/tenderize.token-definition-resolver';
import { TenderizeContractFactory } from './contracts';
import { EthereumTenderizeSwapTokenFetcher } from './ethereum/tenderize.swap.token-fetcher';
import { EthereumTenderizeTenderTokenFetcher } from './ethereum/tenderize.tender.tender.token-fetcher';
import { TenderizeAppDefinition, TENDERIZE_DEFINITION } from './tenderize.definition';

@Register.AppModule({
  appId: TENDERIZE_DEFINITION.id,
  providers: [
    TenderizeAppDefinition,
    TenderizeContractFactory,
    TenderizeTokenDefinitionsResolver,
    // Arbitrum
    ArbitrumTenderizeSwapTokenFetcher,
    ArbitrumTenderizeTenderTokenFetcher,
    // Ethereum
    EthereumTenderizeTenderTokenFetcher,
    EthereumTenderizeSwapTokenFetcher,
  ],
})
export class TenderizeAppModule extends AbstractApp() {}
