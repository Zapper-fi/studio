import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { KwentaViemContractFactory } from './contracts';
import { OptimismKwentaEscrowV2ContractPositionFetcher } from './optimism/kwenta.escrow-v2.contract-position-fetcher';
import { OptimismKwentaEscrowContractPositionFetcher } from './optimism/kwenta.escrow.contract-position-fetcher';
import { OptimismKwentaPerpV1CrossMarginContractPositionFetcher } from './optimism/kwenta.perp-v1-cross-margin.contract-position-fetcher';
import { OptimismKwentaPerpV2SmartMarginContractPositionFetcher } from './optimism/kwenta.perp-v2-smart-margin.contract-position-fetcher';
import { OptimismKwentaStakingV2ContractPositionFetcher } from './optimism/kwenta.staking-v2.contract-position-fetcher';
import { OptimismKwentaStakingContractPositionFetcher } from './optimism/kwenta.staking.contract-position-fetcher';

@Module({
  providers: [
    KwentaViemContractFactory,
    OptimismKwentaPerpV1CrossMarginContractPositionFetcher,
    OptimismKwentaPerpV2SmartMarginContractPositionFetcher,
    OptimismKwentaStakingContractPositionFetcher,
    OptimismKwentaEscrowContractPositionFetcher,
    OptimismKwentaStakingV2ContractPositionFetcher,
    OptimismKwentaEscrowV2ContractPositionFetcher,
  ],
})
export class KwentaAppModule extends AbstractApp() {}
