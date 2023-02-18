import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { KwentaContractFactory } from './contracts';
import { OptimismKwentaPerpV1CrossMarginContractPositionFetcher } from './optimism/kwenta.perp-v1-cross-margin.contract-position-fetcher';
import { OptimismKwentaLpStakingContractPositionFetcher } from './optimism/kwenta.lp-staking.contract-position-fetcher';
import { OptimismKwentaStakingContractPositionFetcher } from './optimism/kwenta.staking.contract-position-fetcher';
import { SynthetixContractFactory } from '../synthetix/contracts';

@Module({
  providers: [
    KwentaContractFactory,
    SynthetixContractFactory,
    OptimismKwentaPerpV1CrossMarginContractPositionFetcher,
    OptimismKwentaStakingContractPositionFetcher,
    OptimismKwentaLpStakingContractPositionFetcher,
  ],
})
export class KwentaAppModule extends AbstractApp() { }
