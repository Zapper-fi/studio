import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { InverseViemContractFactory } from '../contracts';
import { InverseController } from '../contracts/viem';
import { InverseControllerContract } from '../contracts/viem/InverseController';
import { InverseLendingPool, InverseLendingPoolContract } from '../contracts/viem/InverseLendingPool';

@PositionTemplate()
export class EthereumInverseSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  InverseLendingPool,
  InverseController
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x4dcf7407ae5c07f8681e1659f626e114a7667339';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseViemContractFactory) protected readonly contractFactory: InverseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string): InverseLendingPoolContract {
    return this.contractFactory.inverseLendingPool({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string): InverseControllerContract {
    return this.contractFactory.inverseController({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<InverseController>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<InverseLendingPool>) {
    return contract.read.underlying().catch(() => ZERO_ADDRESS);
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<InverseLendingPool>) {
    return contract.read.exchangeRateCurrent();
  }

  async getExchangeRateMantissa({ appToken }: GetPricePerShareParams<InverseLendingPool>) {
    return 18 + appToken.tokens[0].decimals - appToken.decimals;
  }

  async getSupplyRate({ contract }: GetDataPropsParams<InverseLendingPool>) {
    return contract.read.supplyRatePerBlock().catch(() => 0);
  }
}
