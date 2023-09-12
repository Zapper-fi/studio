import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMeanFinanceDcaPositionContractPositionFetcher } from './arbitrum/mean-finance.dca-position.contract-position-fetcher';
import { BinanceSmartChainMeanFinanceDcaPositionContractPositionFetcher } from './binance-smart-chain/mean-finance.dca-position.contract-position-fetcher';
import { MeanFinanceContractFactory } from './contracts';
import { EthereumMeanFinanceDcaPositionContractPositionFetcher } from './ethereum/mean-finance.dca-position.contract-position-fetcher';
import { OptimismMeanFinanceDcaPositionContractPositionFetcher } from './optimism/mean-finance.dca-position.contract-position-fetcher';
import { OptimismMeanFinanceOptimismAirdropContractPositionFetcher } from './optimism/mean-finance.optimism-airdrop.contract-position-fetcher';
import { PolygonMeanFinanceDcaPositionContractPositionFetcher } from './polygon/mean-finance.dca-position.contract-position-fetcher';
@Module({
  providers: [
    MeanFinanceContractFactory,
    OptimismMeanFinanceDcaPositionContractPositionFetcher,
    PolygonMeanFinanceDcaPositionContractPositionFetcher,
    ArbitrumMeanFinanceDcaPositionContractPositionFetcher,
    EthereumMeanFinanceDcaPositionContractPositionFetcher,
    BinanceSmartChainMeanFinanceDcaPositionContractPositionFetcher,
    OptimismMeanFinanceOptimismAirdropContractPositionFetcher,
  ],
})
export class MeanFinanceAppModule extends AbstractApp() {}
