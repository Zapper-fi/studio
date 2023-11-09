import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { InsuraceViemContractFactory } from '../contracts';
import { InsuracePoolToken } from '../contracts/viem';

export type InsuraceMiningTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class InsuraceMiningTokenFetcher extends AppTokenTemplatePositionFetcher<
  InsuracePoolToken,
  DefaultAppTokenDataProps,
  InsuraceMiningTokenDefinition
> {
  abstract insurTokenAddress: string;
  abstract stakersPoolV2Address: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InsuraceViemContractFactory) protected readonly contractFactory: InsuraceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.insuracePoolToken({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<InsuracePoolToken, InsuraceMiningTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({
    appToken,
    multicall,
  }: GetPricePerShareParams<InsuracePoolToken, DefaultAppTokenDataProps, InsuraceMiningTokenDefinition>) {
    const stakersPool = this.contractFactory.insuraceStakersPoolV2({
      address: this.stakersPoolV2Address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(stakersPool).stakedAmountPT(appToken.tokens[0].address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;

    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getApy({
    appToken,
    multicall,
    tokenLoader,
  }: GetDataPropsParams<InsuracePoolToken, DefaultAppTokenDataProps, InsuraceMiningTokenDefinition>) {
    const insurToken = await tokenLoader.getOne({ address: this.insurTokenAddress, network: this.network });
    if (!insurToken) return 0;

    const stakersPool = this.contractFactory.insuraceStakersPoolV2({
      address: this.stakersPoolV2Address,
      network: this.network,
    });

    const [totalInsurPerBlock, totalPoolWeight, poolWeight] = await Promise.all([
      multicall.wrap(stakersPool).read.rewardPerBlock(),
      multicall.wrap(stakersPool).read.totalPoolWeight(),
      multicall.wrap(stakersPool).read.poolWeightPT([appToken.address]),
    ]);

    if (totalPoolWeight.lte(0)) return 0;
    const liquidity = appToken.price * appToken.supply;
    const insurPerBlock = Number(totalInsurPerBlock.mul(poolWeight).div(totalPoolWeight)) / 10 ** insurToken.decimals;
    const blocksPerYear = 365 * BLOCKS_PER_DAY[this.network];

    const apy = ((insurPerBlock * blocksPerYear * insurToken.price) / liquidity) * 100;
    return apy;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<InsuracePoolToken>) {
    return `${getLabelFromToken(appToken.tokens[0])} Pool`;
  }
}
