import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';
import moment from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DollarDisplayItem, PercentageDisplayItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  DefaultAppTokenDefinition,
  GetDefinitionsParams,
  GetAddressesParams,
} from '~position/template/app-token.template.types';

import { PendleContractFactory, PendleOwnershipToken } from '../contracts';

export type PendleOwnershipdTokenDataProps = {
  expiry: number;
  marketAddress: string;
  baseTokenAddress: string;
};

export type PendleOwnershipTokenDefinition = {
  address: string;
  marketAddress: string;
  ownershipTokenAddress: string;
  baseTokenAddress: string;
  yieldTokenAddress: string;
  underlyingAddress: string;
  underlyingYieldAddress: string;
  forgeAddress: string;
  expiry: number;
};

export abstract class PendleOwnershipTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleOwnershipToken,
  PendleOwnershipdTokenDataProps,
  PendleOwnershipTokenDefinition
> {
  abstract pendleDataAddress: string;
  abstract dexFactoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleContractFactory) protected readonly contractFactory: PendleContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<PendleOwnershipTokenDefinition[]> {
    const pendleData = this.contractFactory.pendleData({ address: this.pendleDataAddress, network: this.network });
    const numMarkets = await multicall.wrap(pendleData).allMarketsLength();

    const definitions = await Promise.all(
      range(0, Number(numMarkets)).map(async i => {
        const marketAddress = await pendleData.allMarkets(i);
        const market = this.contractFactory.pendleMarket({ address: marketAddress, network: this.network });
        const [baseTokenAddress, yieldTokenAddress, expiryRaw] = await Promise.all([
          multicall.wrap(market).token(),
          multicall.wrap(market).xyt(),
          multicall.wrap(market).expiry(),
        ]);

        const expiry = Number(expiryRaw);
        const yieldToken = this.contractFactory.pendleYieldToken({
          address: yieldTokenAddress,
          network: this.network,
        });
        const [underlyingAddress, underlyingYieldAddress, forgeAddress] = await Promise.all([
          multicall.wrap(yieldToken).underlyingAsset(),
          multicall.wrap(yieldToken).underlyingYieldToken(),
          multicall.wrap(yieldToken).forge(),
        ]);

        const forge = this.contractFactory.pendleForge({ address: forgeAddress, network: this.network });
        const forgeId = await multicall.wrap(forge).forgeId();
        const ownershipTokenAddress = await multicall.wrap(pendleData).otTokens(forgeId, underlyingAddress, expiry);

        return {
          address: ownershipTokenAddress.toLowerCase(),
          marketAddress: marketAddress.toLowerCase(),
          ownershipTokenAddress: ownershipTokenAddress.toLowerCase(),
          baseTokenAddress: baseTokenAddress.toLowerCase(),
          yieldTokenAddress: yieldTokenAddress.toLowerCase(),
          underlyingAddress: underlyingAddress.toLowerCase(),
          underlyingYieldAddress: underlyingYieldAddress.toLowerCase(),
          forgeAddress: forgeAddress.toLowerCase(),
          expiry,
        };
      }),
    );

    return definitions;
  }

  getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  getContract(address: string) {
    return this.contractFactory.pendleOwnershipToken({ address, network: this.network });
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PendleOwnershipToken>) {
    return contract.underlyingYieldToken();
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
    tokenLoader,
  }: GetPricePerShareParams<PendleOwnershipToken, PendleOwnershipdTokenDataProps, PendleOwnershipTokenDefinition>) {
    const { expiry, baseTokenAddress } = definition;
    const baseToken = await tokenLoader.getOne({ address: baseTokenAddress.toLowerCase(), network: this.network });
    if (!baseToken || Date.now() / 1000 > Number(expiry)) return 0;

    const dexFactory = this.contractFactory.pendleDexFactory({
      address: this.dexFactoryAddress,
      network: this.network,
    });

    const pairAddress = await multicall.wrap(dexFactory).getPair(appToken.address, baseTokenAddress);
    if (pairAddress === ZERO_ADDRESS) return 0;

    const pair = this.contractFactory.pendleDexPair({ address: pairAddress, network: this.network });
    const [token0, reserves] = await Promise.all([multicall.wrap(pair).token0(), multicall.wrap(pair).getReserves()]);

    const [baseReserve, otReserve] =
      token0.toLowerCase() === baseTokenAddress
        ? [reserves._reserve0, reserves._reserve1]
        : [reserves._reserve1, reserves._reserve0];

    const otPrice = new BigNumber(baseToken.price)
      .multipliedBy(Number(baseReserve) / 10 ** baseToken.decimals)
      .div(Number(otReserve) / 10 ** appToken.decimals)
      .toNumber();

    return otPrice / appToken.tokens[0].price;
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<PendleOwnershipToken, PendleOwnershipdTokenDataProps, PendleOwnershipTokenDefinition>) {
    const { marketAddress, baseTokenAddress, expiry } = definition;
    return { marketAddress, baseTokenAddress, expiry };
  }

  async getLabel({
    appToken,
    definition,
    tokenLoader,
  }: GetDisplayPropsParams<PendleOwnershipToken, PendleOwnershipdTokenDataProps, PendleOwnershipTokenDefinition>) {
    const baseToken = await tokenLoader.getOne({ address: definition.baseTokenAddress, network: this.network });
    return `OT ${getLabelFromToken(appToken.tokens[0])}${baseToken ? ` - ${baseToken.symbol}` : ''}`;
  }

  async getTertiaryLabel({
    appToken,
  }: GetDisplayPropsParams<
    PendleOwnershipToken,
    PendleOwnershipdTokenDataProps,
    PendleOwnershipTokenDefinition
  >): Promise<string | number | DollarDisplayItem | PercentageDisplayItem | undefined> {
    const { expiry } = appToken.dataProps;
    return `Expires ${moment.unix(expiry).format('LL')}`;
  }
}
