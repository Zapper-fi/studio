import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GoldfinchContractFactory } from './contracts';
import { EthereumGoldfinchFiduTokenFetcher } from './ethereum/goldfinch.fidu.token-fetcher';
import { EthereumGoldfinchSeniorBondContractPositionFetcher } from './ethereum/goldfinch.senior-bond.contract-position-fetcher';
import { EthereumGoldfinchVaultContractPositionFetcher } from './ethereum/goldfinch.vault.contract-position-fetcher';

@Module({
  providers: [
    GoldfinchContractFactory,
    EthereumGoldfinchFiduTokenFetcher,
    EthereumGoldfinchSeniorBondContractPositionFetcher,
    EthereumGoldfinchVaultContractPositionFetcher,
  ],
})
export class GoldfinchAppModule extends AbstractApp() {}
