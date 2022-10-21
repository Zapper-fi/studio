import { Inject } from '@nestjs/common';
import { uniq } from 'lodash';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AcrossContractFactory, AcrossV2PoolToken } from '../contracts';

export type AcrossV2PoolTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class AcrossV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  AcrossV2PoolToken,
  DefaultAppTokenDataProps,
  AcrossV2PoolTokenDefinition
> {
  abstract hubAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AcrossV2PoolToken {
    return this.contractFactory.acrossV2PoolToken({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<AcrossV2PoolTokenDefinition[]> {
    const hub = this.contractFactory.acrossV2HubPool({ address: this.hubAddress, network: this.network });
    const logs = await hub.queryFilter(hub.filters.LiquidityAdded(), 14819537);
    const collateral = uniq(logs.map(v => v.args.l1Token.toLowerCase()));

    const lpTokens = await Promise.all(collateral.map(c => multicall.wrap(hub).pooledTokens(c)));
    const definitions = collateral.map((c, i) => ({
      address: lpTokens[i].lpToken.toLowerCase(),
      underlyingTokenAddress: c,
    }));

    console.log(definitions);
    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<AcrossV2PoolToken, AcrossV2PoolTokenDefinition>) {
    return [definition.underlyingTokenAddress];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<AcrossV2PoolToken>) {
    const hub = this.contractFactory.acrossV2HubPool({ address: this.hubAddress, network: this.network });
    const poolInfo = await multicall.wrap(hub).pooledTokens(appToken.tokens[0].address);
    const reserveRaw = poolInfo.liquidReserves.add(poolInfo.utilizedReserves).sub(poolInfo.undistributedLpFees);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve / appToken.supply];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AcrossV2PoolToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<AcrossV2PoolToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<AcrossV2PoolToken>) {
    return 0;
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<AcrossV2PoolToken, DefaultAppTokenDataProps, AcrossV2PoolTokenDefinition>): Promise<string> {
    return `${getLabelFromToken(appToken.tokens[0])} Pool`;
  }
}
