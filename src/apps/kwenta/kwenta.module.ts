import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SynthetixContractFactory } from '../synthetix/contracts';

import { KwentaContractFactory } from './contracts';
import { OptimismKwentaPerpV1CrossMarginContractPositionFetcher } from './optimism/kwenta.perp-v1-cross-margin.contract-position-fetcher';
import { OptimismKwentaPerpV2SmartMarginContractPositionFetcher } from './optimism/kwenta.perp-v2-smart-margin.contract-position-fetcher';
import { OptimismKwentaStakingContractPositionFetcher } from './optimism/kwenta.staking.contract-position-fetcher';
import { OptimismKwentaEscrowContractPositionFetcher } from './optimism/kwenta.escrow.contract-position-fetcher';


@Module({
  providers: [
    KwentaContractFactory,
    SynthetixContractFactory,
    OptimismKwentaPerpV1CrossMarginContractPositionFetcher,
    OptimismKwentaPerpV2SmartMarginContractPositionFetcher,
    OptimismKwentaStakingContractPositionFetcher,
    OptimismKwentaEscrowContractPositionFetcher,
  ],
})
export class KwentaAppModule extends AbstractApp() { }
