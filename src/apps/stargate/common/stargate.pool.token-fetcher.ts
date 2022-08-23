import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesStageParams,
  GetDataPropsStageParams,
  GetPricePerShareStageParams,
  GetUnderlyingTokensStageParams,
} from '~position/template/app-token.template.types';

import { StargatePool, StargateContractFactory } from '../contracts';

export type StargatePoolTokenDataProps = {
  liquidity: number;
  reserve: number;
};

export abstract class StargatePoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  StargatePool,
  StargatePoolTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) protected readonly contractFactory: StargateContractFactory,
  ) {
    super(appToolkit);
  }

  abstract factoryAddress: string;
  abstract useLocalDecimals: boolean;

  getContract(address: string) {
    return this.contractFactory.stargatePool({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesStageParams) {
    const factory = this.contractFactory.stargateFactory({
      address: this.factoryAddress,
      network: this.network,
    });

    const numPools = await multicall.wrap(factory).allPoolsLength();
    return Promise.all(range(0, Number(numPools)).map(pid => multicall.wrap(factory).allPools(pid)));
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensStageParams<StargatePool>) {
    return contract.token();
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareStageParams<StargatePool, DefaultDataProps>) {
    const lpAmount = new BigNumber(10 ** appToken.tokens[0].decimals).toFixed(0);
    const [convertRate, localDecimalsRaw, pricePerShareRaw] = await Promise.all([
      contract.convertRate(),
      contract.localDecimals(),
      contract.amountLPtoLD(lpAmount).catch(() => 0),
    ]);

    const pricePerShare = this.useLocalDecimals
      ? Number(pricePerShareRaw) / Number(convertRate) / 10 ** Number(localDecimalsRaw)
      : Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return pricePerShare;
  }

  async getDataProps({
    appToken,
    multicall,
  }: GetDataPropsStageParams<StargatePool, StargatePoolTokenDataProps>): Promise<StargatePoolTokenDataProps> {
    const underlyingToken = appToken.tokens[0]!;
    const underlying = this.contractFactory.erc20(underlyingToken);
    const reserveRaw = await multicall.wrap(underlying).balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    const liquidity = reserve * underlyingToken.price;
    return { reserve, liquidity };
  }
}
