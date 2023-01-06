import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SonneContractFactory } from './contracts';
import { OptimismSonneBorrowContractPositionFetcher } from './optimism/sonne.borrow.contract-position-fetcher';
import { OptimismSonnePositionPresenter } from './optimism/sonne.position-presenter';
import { OptimismSonneSupplyTokenFetcher } from './optimism/sonne.supply.token-fetcher';
import { SonneAppDefinition } from './sonne.definition';

@Module({
  providers: [
    SonneAppDefinition,
    SonneContractFactory,
    OptimismSonnePositionPresenter,
    OptimismSonneBorrowContractPositionFetcher,
    OptimismSonneSupplyTokenFetcher,
  ],
})
export class SonneAppModule extends AbstractApp() {}
