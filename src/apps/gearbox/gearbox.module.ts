import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { GearboxContractFactory } from './contracts';
import { EthereumGearboxCreditAccountsContractPositionFetcher } from './ethereum/gearbox.credit-accounts.contract-position-fetcher';
import { EthereumGearboxLendingTokenFetcher } from './ethereum/gearbox.lending.token-fetcher';
import { EthereumGearboxPhantomTokenFetcher } from './ethereum/gearbox.phantom.token-fetcher';
import { GearboxAppDefinition } from './gearbox.definition';

@Module({
  providers: [
    GearboxAppDefinition,
    GearboxContractFactory,
    EthereumGearboxCreditAccountsContractPositionFetcher,
    EthereumGearboxLendingTokenFetcher,
    EthereumGearboxPhantomTokenFetcher,
  ],
})
export class GearboxAppModule extends AbstractApp() {}
