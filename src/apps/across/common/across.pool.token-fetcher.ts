import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetPriceParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AcrossContractFactory, BadgerPool } from '../contracts';

export type AcrossPoolTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class AcrossPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BadgerPool,
  DefaultDataProps,
  AcrossPoolTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BadgerPool {
    return this.contractFactory.badgerPool({ network: this.network, address });
  }

  async getAddresses({ definitions }: GetAddressesParams<AcrossPoolTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({ definition }: GetUnderlyingTokensParams<BadgerPool, AcrossPoolTokenDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<BadgerPool>) {
    const pricePerShareRaw = await multicall.wrap(contract).callStatic.exchangeRateCurrent();
    const decimals = appToken.tokens[0].decimals;

    return Number(pricePerShareRaw) / 10 ** decimals;
  }

  async getPrice({ appToken }: GetPriceParams<BadgerPool>) {
    return appToken.tokens[0].price * Number(appToken.pricePerShare);
  }

  async getDataProps(opts: GetDataPropsParams<BadgerPool>) {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;

    return { liquidity };
  }
}
