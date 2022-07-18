import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumTenderizeBalanceFetcher } from './arbitrum/tenderize.balance-fetcher';
import { ArbitrumTenderizeSwapTokenFetcher } from './arbitrum/tenderize.swap.token-fetcher';
import { ArbitrumTenderizeTenderTokenFetcher } from './arbitrum/tenderize.tender.token-fetcher';
import { TenderizeContractFactory } from './contracts';
import { EthereumTenderizeBalanceFetcher } from './ethereum/tenderize.balance-fetcher';
import { EthereumTenderizeSwapTokenFetcher } from './ethereum/tenderize.swap.token-fetcher';
import { EthereumTenderizeTenderTokenFetcher } from './ethereum/tenderize.tender.token-fetcher';
import { TenderizeAppDefinition, TENDERIZE_DEFINITION } from './tenderize.definition';

@Register.AppModule({
  appId: TENDERIZE_DEFINITION.id,
  providers: [
    ArbitrumTenderizeBalanceFetcher,
    ArbitrumTenderizeSwapTokenFetcher,
    ArbitrumTenderizeTenderTokenFetcher,
    EthereumTenderizeBalanceFetcher,
    EthereumTenderizeSwapTokenFetcher,
    EthereumTenderizeTenderTokenFetcher,
    TenderizeAppDefinition,
    TenderizeContractFactory,
  ],
})
export class TenderizeAppModule extends AbstractApp() {}
