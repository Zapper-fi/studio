import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';
import { unix } from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
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
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { PendleContractFactory, PendleOwnershipToken } from '../contracts';

export type PendleOwnershipTokenDataProps = DefaultAppTokenDataProps & {
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

@PositionTemplate()
export class EthereumPendleOwnershipTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleOwnershipToken,
  PendleOwnershipTokenDataProps,
  PendleOwnershipTokenDefinition
> {
  groupLabel = 'Ownership';
  pendleDataAddress = '0xe8a6916576832aa5504092c1cccc46e3bb9491d6';
  dexFactoryAddress = '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac';

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

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PendleOwnershipToken>) {
    return [{ address: await contract.underlyingYieldToken(), network: this.network }];
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
    tokenLoader,
  }: GetPricePerShareParams<PendleOwnershipToken, PendleOwnershipTokenDataProps, PendleOwnershipTokenDefinition>) {
    const { expiry, baseTokenAddress } = definition;
    const baseToken = await tokenLoader.getOne({ address: baseTokenAddress.toLowerCase(), network: this.network });
    if (!baseToken || Date.now() / 1000 > Number(expiry)) return [0];

    const dexFactory = this.contractFactory.pendleDexFactory({
      address: this.dexFactoryAddress,
      network: this.network,
    });

    const pairAddress = await multicall.wrap(dexFactory).getPair(appToken.address, baseTokenAddress);
    if (pairAddress === ZERO_ADDRESS) return [0];

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

    return [otPrice / appToken.tokens[0].price];
  }

  async getDataProps(
    params: GetDataPropsParams<PendleOwnershipToken, PendleOwnershipTokenDataProps, PendleOwnershipTokenDefinition>,
  ) {
    const defaultDataProps = await super.getDataProps(params);
    const { marketAddress, baseTokenAddress, expiry } = params.definition;
    return { ...defaultDataProps, marketAddress, baseTokenAddress, expiry };
  }

  async getLabel({
    appToken,
    definition,
    tokenLoader,
  }: GetDisplayPropsParams<PendleOwnershipToken, PendleOwnershipTokenDataProps, PendleOwnershipTokenDefinition>) {
    const baseToken = await tokenLoader.getOne({ address: definition.baseTokenAddress, network: this.network });
    return `OT ${getLabelFromToken(appToken.tokens[0])}${baseToken ? ` - ${baseToken.symbol}` : ''}`;
  }

  async getTertiaryLabel({
    appToken,
  }: GetDisplayPropsParams<
    PendleOwnershipToken,
    PendleOwnershipTokenDataProps,
    PendleOwnershipTokenDefinition
  >): Promise<string | number | DollarDisplayItem | PercentageDisplayItem | undefined> {
    const { expiry } = appToken.dataProps;
    return `Expires ${unix(expiry).format('LL')}`;
  }
}
