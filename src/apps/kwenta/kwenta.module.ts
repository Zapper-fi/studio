import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SynthetixContractFactory } from '../synthetix/contracts';

import { KwentaContractFactory } from './contracts';
import { OptimismKwentaEscrowContractPositionFetcher } from './optimism/kwenta.escrow.contract-position-fetcher';
import { OptimismKwentaPerpV1CrossMarginContractPositionFetcher } from './optimism/kwenta.perp-v1-cross-margin.contract-position-fetcher';
import { OptimismKwentaPerpV2SmartMarginContractPositionFetcher } from './optimism/kwenta.perp-v2-smart-margin.contract-position-fetcher';
import { OptimismKwentaStakingContractPositionFetcher } from './optimism/kwenta.staking.contract-position-fetcher';
import { OptimismKwentaStakingV2ContractPositionFetcher } from './optimism/kwenta.staking-v2.contract-position-fetcher';

@Module({
  providers: [
    KwentaContractFactory,
    SynthetixContractFactory,
    OptimismKwentaPerpV1CrossMarginContractPositionFetcher,
    OptimismKwentaPerpV2SmartMarginContractPositionFetcher,
    OptimismKwentaStakingContractPositionFetcher,
    OptimismKwentaEscrowContractPositionFetcher,
    OptimismKwentaStakingV2ContractPositionFetcher,
  ],
})
export class KwentaAppModule extends AbstractApp() { }
