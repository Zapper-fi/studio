import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { TeahouseContractFactory } from './contracts';
import { OptimismTeahouseVaultsContractPositionFetcher } from './optimism/teahouse.vaults.contract-position-fetcher';

@Module({
    providers: [
        TeahouseContractFactory,
        OptimismTeahouseVaultsContractPositionFetcher,
    ],
})
export class TeahouseAppModule extends AbstractApp() { }
