import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { YieldProtocolContractFactory, YieldProtocolPoolToken } from '../contracts';

import { formatMaturity } from './yield-protocol.lend.token-fetcher';

export type YieldProtocolPoolTokenDataProps = {
  liquidity: number;
  reserves: number[];
  apy: number;
  maturity: number;
};

export abstract class YieldProtocolPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  YieldProtocolPoolToken,
  YieldProtocolPoolTokenDataProps
> {
  abstract poolTokenAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) protected readonly contractFactory: YieldProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YieldProtocolPoolToken {
    return this.contractFactory.yieldProtocolPoolToken({ address, network: this.network });
  }

  async getAddresses() {
    return this.poolTokenAddresses;
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<YieldProtocolPoolToken>) {
    return [await contract.base()];
  }

  async getPricePerShare({ appToken, contract, multicall }: GetPricePerShareParams<YieldProtocolPoolToken>) {
    const poolAddress = await contract.pool();
    const poolContract = this.contractFactory.yieldProtocolPool({ address: poolAddress, network: this.network });

    const [baseReserves, fyTokenReserves, poolTotalSupply] = await Promise.all([
      multicall.wrap(poolContract).getBaseBalance(),
      multicall.wrap(poolContract).getFYTokenBalance(),
      multicall.wrap(poolContract).totalSupply(),
    ]);

    const realFyTokenReserves = fyTokenReserves.sub(poolTotalSupply);
    const reserveRaw = baseReserves.add(realFyTokenReserves);
    const reserve = Number(reserveRaw);
    return reserve / appToken.supply;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<YieldProtocolPoolToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<YieldProtocolPoolToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<YieldProtocolPoolToken>) {
    return 0;
  }

  async getDataProps(params: GetDataPropsParams<YieldProtocolPoolToken>) {
    const defaultDataProps = await super.getDataProps(params);

    const { contract, multicall } = params;
    const poolAddress = await contract.pool();
    const poolContract = this.contractFactory.yieldProtocolPool({ address: poolAddress, network: this.network });
    const maturity = await multicall.wrap(poolContract).maturity();

    return { ...defaultDataProps, maturity: Number(maturity) };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<YieldProtocolPoolToken>) {
    return `Yield ${getLabelFromToken(appToken.tokens[0])} Strategy`;
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<YieldProtocolPoolToken, YieldProtocolPoolTokenDataProps>) {
    return `Automatic Roll on ${formatMaturity(appToken.dataProps.maturity)}`;
  }
}
