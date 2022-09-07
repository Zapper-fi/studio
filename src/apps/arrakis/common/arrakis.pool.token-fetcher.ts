import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { StatsItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { ArrakisContractFactory, ArrakisGelatoPool } from '../contracts';

import { ArrakisPoolDefinitionsResolver } from './arrakis.pool-definition-resolver';

export type ArrakisPoolDefinition = {
  address: string;
  underlyingTokenAddress0: string;
  underlyingTokenAddress1: string;
};

export type ArrakisPoolTokenDataProps = {
  liquidity: number;
  fee: number;
  reserves: number[];
};

export abstract class ArrakisPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  ArrakisGelatoPool,
  ArrakisPoolTokenDataProps,
  ArrakisPoolDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArrakisPoolDefinitionsResolver)
    private readonly poolDefinitionsResolver: ArrakisPoolDefinitionsResolver,
    @Inject(ArrakisContractFactory) private readonly contractFactory: ArrakisContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ArrakisGelatoPool {
    return this.contractFactory.arrakisGelatoPool({ network: this.network, address });
  }

  async getDefinitions(): Promise<ArrakisPoolDefinition[]> {
    return this.poolDefinitionsResolver.getPoolDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams<ArrakisPoolDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<ArrakisGelatoPool, ArrakisPoolDefinition>) {
    return [definition.underlyingTokenAddress0, definition.underlyingTokenAddress1];
  }

  async getPricePerShare({
    appToken,
    contract,
  }: GetPricePerShareParams<ArrakisGelatoPool, ArrakisPoolTokenDataProps, ArrakisPoolDefinition>) {
    const reservesRaw = await contract.getUnderlyingBalances();
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(r => {
      return r == 0 ? 0 : r / appToken.supply;
    });
    return pricePerShare;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<ArrakisGelatoPool, ArrakisPoolTokenDataProps>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<ArrakisGelatoPool, ArrakisPoolTokenDataProps, ArrakisPoolDefinition>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }

  async getDataProps({
    appToken,
    contract,
    multicall,
  }: GetDataPropsParams<ArrakisGelatoPool, ArrakisPoolTokenDataProps, ArrakisPoolDefinition>) {
    const reserves = (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
    const liquidity = appToken.price * appToken.supply;
    const gelatoFeeRaw = await contract.gelatoFeeBPS().catch(e => {
      if (isMulticallUnderlyingError(e)) return null;
      throw e;
    });
    const arrakisFeeRaw = await multicall
      .wrap(this.contractFactory.arrakisPool({ network: this.network, address: appToken.address }))
      .arrakisFeeBPS()
      .catch(e => {
        if (isMulticallUnderlyingError(e)) return null;
        throw e;
      });
    const feeRaw = gelatoFeeRaw ?? arrakisFeeRaw ?? 0;
    const fee = feeRaw / 10 ** 4;

    return { liquidity, fee, reserves };
  }

  async getStatsItems({
    appToken,
  }: GetDisplayPropsParams<ArrakisGelatoPool, ArrakisPoolTokenDataProps, ArrakisPoolDefinition>): Promise<
    StatsItem[] | undefined
  > {
    const { fee, reserves, liquidity } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    const ratioDisplay = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
    const reservesDisplay = reserves.map(v => (v < 0.01 ? '<0.01' : v.toFixed(2))).join(' / ');

    return [
      { label: 'Fee', value: buildPercentageDisplayItem(fee) },
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Reserves', value: reservesDisplay },
      { label: 'Ratio', value: ratioDisplay },
    ];
  }
}
