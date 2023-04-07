import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SiloFinanceDefinitionResolver } from './common/silo-finance.definition-resolver';
import { SiloFinanceContractFactory } from './contracts';
import { EthereumSTokenTokenFetcher } from './ethereum/silo-finance.s-token.token-fetcher';
import { EthereumSPTokenTokenFetcher } from './ethereum/silo-finance.sp-token.token-fetcher';

@Module({
  providers: [
    SiloFinanceContractFactory,
    SiloFinanceDefinitionResolver,
    // Arbitrum
    // ArbitrumSTokenTokenFetcher,
    // ArbitrumSPTokenTokenFetcher,
    // ArbitrumDTokenTokenFetcher,
    // ArbitrumSiloFinanceSiloContractPositionFetcher,
    // ArbitrumSiloFinanceIncentivesContractPositionfetcher,
    // Ethereum
    EthereumSTokenTokenFetcher,
    EthereumSPTokenTokenFetcher,
    // EthereumDTokenTokenFetcher,
    // EthereumSiloFinanceSiloContractPositionFetcher,
    // EthereumSiloFinanceIncentivesContractPositionfetcher,
  ],
})
export class SiloFinanceAppModule extends AbstractApp() {}
