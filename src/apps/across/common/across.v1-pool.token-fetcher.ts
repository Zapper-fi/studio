import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AcrossContractFactory, BadgerPool } from '../contracts';

export abstract class AcrossV1PoolTokenFetcher extends AppTokenTemplatePositionFetcher<BadgerPool> {
  abstract poolAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BadgerPool {
    return this.contractFactory.badgerPool({ network: this.network, address });
  }

  async getAddresses() {
    return this.poolAddresses;
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BadgerPool>) {
    return contract.l1Token();
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<BadgerPool>) {
    const pricePerShareRaw = await multicall.wrap(contract).callStatic.exchangeRateCurrent();
    const decimals = appToken.tokens[0].decimals;
    return Number(pricePerShareRaw) / 10 ** decimals;
  }

  async getLiquidity({ contract, appToken }: GetDataPropsParams<BadgerPool>) {
    const reserveRaw = await contract.liquidReserves();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve * appToken.tokens[0].price;
  }

  async getReserves({ contract, appToken }: GetDataPropsParams<BadgerPool>) {
    const reserveRaw = await contract.liquidReserves();
    return [Number(reserveRaw) / 10 ** appToken.tokens[0].decimals];
  }

  async getApy(_params: GetDataPropsParams<BadgerPool>) {
    return 0;
  }
}
