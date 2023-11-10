import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { YieldProtocolViemContractFactory } from '../contracts';
import { YieldProtocolPoolToken } from '../contracts/viem';

import { formatMaturity } from './yield-protocol.lend.token-fetcher';

export type YieldProtocolPoolTokenDataProps = DefaultAppTokenDataProps & {
  maturity: number;
};

export abstract class YieldProtocolPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  YieldProtocolPoolToken,
  YieldProtocolPoolTokenDataProps
> {
  abstract poolTokenAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolViemContractFactory) protected readonly contractFactory: YieldProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.yieldProtocolPoolToken({ address, network: this.network });
  }

  async getAddresses() {
    return this.poolTokenAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<YieldProtocolPoolToken>) {
    return [{ address: await contract.read.base(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract, multicall }: GetPricePerShareParams<YieldProtocolPoolToken>) {
    const poolAddress = await contract.read.pool();
    if (poolAddress === ZERO_ADDRESS) return [0];

    const poolContract = this.contractFactory.yieldProtocolPool({ address: poolAddress, network: this.network });
    const baseReserves = await multicall
      .wrap(poolContract)
      .read.getBaseBalance()
      .catch(err => {
        if (isViemMulticallUnderlyingError(err)) return BigNumber.from(0);
        throw err;
      });

    if (Number(baseReserves) === 0) return [0];

    const [fyTokenReserves, poolTotalSupply] = await Promise.all([
      multicall.wrap(poolContract).read.getFYTokenBalance(),
      multicall.wrap(poolContract).read.totalSupply(),
    ]);

    const realFyTokenReserves = BigNumber.from(fyTokenReserves).sub(poolTotalSupply);
    const reserveRaw = BigNumber.from(baseReserves).add(realFyTokenReserves);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getDataProps(params: GetDataPropsParams<YieldProtocolPoolToken>) {
    const defaultDataProps = await super.getDataProps(params);

    const { contract, multicall } = params;
    const poolAddress = await contract.read.pool();
    const poolContract = this.contractFactory.yieldProtocolPool({ address: poolAddress, network: this.network });
    if (poolAddress === ZERO_ADDRESS) return { ...defaultDataProps, maturity: 0 };

    const maturity = await multicall.wrap(poolContract).read.maturity();
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
