import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumTenderizeBalanceFetcher } from './arbitrum/tenderize.balance-fetcher';
import { ArbitrumTenderizeSwaptokensTokenFetcher } from './arbitrum/tenderize.swaptokens.token-fetcher';
import { ArbitrumTenderizeTenderTokensTokenFetcher } from './arbitrum/tenderize.tender-tokens.token-fetcher';
import { TenderizeContractFactory } from './contracts';
import { EthereumTenderizeBalanceFetcher } from './ethereum/tenderize.balance-fetcher';
import { EthereumTenderizeBalanceFetcher } from './ethereum/tenderize.balance-fetcher';
import { EthereumTenderizeSwapTokensTokenFetcher } from './ethereum/tenderize.swaptokens.token-fetcher';
import { EthereumTenderizeTenderTokensTokenFetcher } from './ethereum/tenderize.tender-tokens.token-fetcher';
import { TenderizeAppDefinition, TENDERIZE_DEFINITION } from './tenderize.definition';

@Register.AppModule({
  appId: TENDERIZE_DEFINITION.id,
  providers: [
    ArbitrumTenderizeBalanceFetcher,
    ArbitrumTenderizeSwaptokensTokenFetcher,
    ArbitrumTenderizeTenderTokensTokenFetcher,
    EthereumTenderizeBalanceFetcher,
    EthereumTenderizeBalanceFetcher,
    EthereumTenderizeSwapTokensTokenFetcher,
    EthereumTenderizeTenderTokensTokenFetcher,
    TenderizeAppDefinition,
    TenderizeContractFactory,
  ],
})
export class TenderizeAppModule extends AbstractApp() {}
