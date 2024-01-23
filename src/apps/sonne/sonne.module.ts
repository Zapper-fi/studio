import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BaseSonneBorrowContractPositionFetcher } from './base/sonne.borrow.contract-position-fetcher';
import { BaseSonnePositionPresenter } from './base/sonne.position-presenter';
import { BaseSonneSupplyTokenFetcher } from './base/sonne.supply.token-fetcher';
import { SonneViemContractFactory } from './contracts';
import { OptimismSonneBorrowContractPositionFetcher } from './optimism/sonne.borrow.contract-position-fetcher';
import { OptimismSonnePositionPresenter } from './optimism/sonne.position-presenter';
import { OptimismSonneStakingContractPositionFetcher } from './optimism/sonne.staking.contract-position-fetcher';
import { OptimismSonneSupplyTokenFetcher } from './optimism/sonne.supply.token-fetcher';

@Module({
  providers: [
    SonneViemContractFactory,
    // Base
    BaseSonnePositionPresenter,
    BaseSonneBorrowContractPositionFetcher,
    BaseSonneSupplyTokenFetcher,
    // Optimism
    OptimismSonnePositionPresenter,
    OptimismSonneBorrowContractPositionFetcher,
    OptimismSonneSupplyTokenFetcher,
    OptimismSonneStakingContractPositionFetcher,
  ],
})
export class SonneAppModule extends AbstractApp() {}
