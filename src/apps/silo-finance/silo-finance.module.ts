import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

//import { ArbitrumMarketAssetsTokenFetcher } from './arbitrum/silo-finance.market-asset.token-fetcher';
import { ArbitrumSiloFinanceSiloContractPositionFetcher } from './arbitrum/silo-finance.silo.contract-position-fetcher';
import { SiloFinanceDefinitionResolver } from './common/silo-finance.definition-resolver';
import { SiloFinanceContractFactory } from './contracts';
//import { EthereumMarketAssetsTokenFetcher } from './ethereum/silo-finance.market-asset.token-fetcher';
import { EthereumSiloFinanceSiloContractPositionFetcher } from './ethereum/silo-finance.silo.contract-position-fetcher';

@Module({
  providers: [
    SiloFinanceContractFactory,
    SiloFinanceDefinitionResolver,
    // Arbitrum
    ArbitrumSiloFinanceSiloContractPositionFetcher,
    //ArbitrumMarketAssetsTokenFetcher,
    // Ethereum
    EthereumSiloFinanceSiloContractPositionFetcher,
    //EthereumMarketAssetsTokenFetcher,
  ],
})
export class SiloFinanceAppModule extends AbstractApp() {}
