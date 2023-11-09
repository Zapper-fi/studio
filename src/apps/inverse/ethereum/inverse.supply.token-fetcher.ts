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

import { InverseContractFactory, InverseController } from '../contracts';
import { InverseLendingPool } from '../contracts/viem/InverseLendingPool';

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

  getCompoundCTokenContract(address: string): InverseLendingPool {
    return this.contractFactory.inverseLendingPool({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string): InverseController {
    return this.contractFactory.inverseController({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<InverseController>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<InverseLendingPool>) {
    return contract.underlying().catch(() => ZERO_ADDRESS);
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<InverseLendingPool>) {
    return contract.exchangeRateCurrent();
  }

  async getExchangeRateMantissa({ appToken }: GetPricePerShareParams<InverseLendingPool>) {
    return 18 + appToken.tokens[0].decimals - appToken.decimals;
  }

  async getSupplyRate({ contract }: GetDataPropsParams<InverseLendingPool>) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }
}
