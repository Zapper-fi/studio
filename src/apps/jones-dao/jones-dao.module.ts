import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumJonesDaoFarmContractPositionFetcher } from './arbitrum/jones-dao.farm.contract-position-fetcher';
import { ArbitrumJonesDaoMetavaultTokenFetcher } from './arbitrum/jones-dao.metavault.contract-position-fetcher';
import { ArbitrumJonesDaoMillinerV2ContractPositionFetcher } from './arbitrum/jones-dao.milliner-v2.contract-position-fetcher';
import { ArbitrumJonesDaoStrategyTokenFetcher } from './arbitrum/jones-dao.strategy.token-fetcher';
import { ArbitrumJonesDaoVaultTokenFetcher } from './arbitrum/jones-dao.vault.token-fetcher';
import { JonesDaoContractFactory } from './contracts';

@Module({
  providers: [
    JonesDaoContractFactory,
    ArbitrumJonesDaoFarmContractPositionFetcher,
    ArbitrumJonesDaoMillinerV2ContractPositionFetcher,
    ArbitrumJonesDaoVaultTokenFetcher,
    ArbitrumJonesDaoMetavaultTokenFetcher,
    ArbitrumJonesDaoStrategyTokenFetcher,
  ],
})
export class JonesDaoAppModule extends AbstractApp() {}
