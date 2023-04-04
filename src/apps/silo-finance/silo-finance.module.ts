import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDTokenTokenFetcher } from './arbitrum/silo-finance.d-token.token-fetcher';
import { ArbitrumSiloFinanceIncentivesContractPositionfetcher } from './arbitrum/silo-finance.incentives.contract-position-fetcher';
import { ArbitrumSTokenTokenFetcher } from './arbitrum/silo-finance.s-token.token-fetcher';
import { ArbitrumSiloFinanceSiloContractPositionFetcher } from './arbitrum/silo-finance.silo.contract-position-fetcher';
import { ArbitrumSPTokenTokenFetcher } from './arbitrum/silo-finance.sp-token.token-fetcher';
import { SiloFinanceDefinitionResolver } from './common/silo-finance.definition-resolver';
import { SiloFinanceContractFactory } from './contracts';
import { EthereumDTokenTokenFetcher } from './ethereum/silo-finance.d-token.token-fetcher';
import { EthereumSiloFinanceIncentivesContractPositionfetcher } from './ethereum/silo-finance.incentives.contract-position-fetcher';
import { EthereumSTokenTokenFetcher } from './ethereum/silo-finance.s-token.token-fetcher';
import { EthereumSiloFinanceSiloContractPositionFetcher } from './ethereum/silo-finance.silo.contract-position-fetcher';
import { EthereumSPTokenTokenFetcher } from './ethereum/silo-finance.sp-token.token-fetcher';

@Module({
  providers: [
    SiloFinanceContractFactory,
    SiloFinanceDefinitionResolver,
    // Arbitrum
    ArbitrumSTokenTokenFetcher,
    ArbitrumSPTokenTokenFetcher,
    ArbitrumDTokenTokenFetcher,
    ArbitrumSiloFinanceSiloContractPositionFetcher,
    ArbitrumSiloFinanceIncentivesContractPositionfetcher,
    // Ethereum
    EthereumSTokenTokenFetcher,
    EthereumSPTokenTokenFetcher,
    EthereumDTokenTokenFetcher,
    EthereumSiloFinanceSiloContractPositionFetcher,
    EthereumSiloFinanceIncentivesContractPositionfetcher,
  ],
})
export class SiloFinanceAppModule extends AbstractApp() {}
