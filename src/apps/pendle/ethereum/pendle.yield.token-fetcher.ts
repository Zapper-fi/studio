import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';
import { unix } from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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

import { PendleContractFactory, PendleYieldToken } from '../contracts';

export type PendleYieldTokenDataProps = DefaultAppTokenDataProps & {
  expiry: number;
  baseTokenAddress: string;
  marketAddress: string;
};

export type PendleYieldTokenDefinition = {
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
export class EthereumPendleYieldTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleYieldToken,
  PendleYieldTokenDataProps,
  PendleYieldTokenDefinition
> {
  groupLabel = 'Future Yield';
  pendleDataAddress = '0xe8a6916576832aa5504092c1cccc46e3bb9491d6';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PendleContractFactory) protected readonly contractFactory: PendleContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<PendleYieldTokenDefinition[]> {
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
        const yieldToken = this.contractFactory.pendleYieldToken({ address: yieldTokenAddress, network: this.network });
        const [underlyingAddress, underlyingYieldAddress, forgeAddress] = await Promise.all([
          multicall.wrap(yieldToken).underlyingAsset(),
          multicall.wrap(yieldToken).underlyingYieldToken(),
          multicall.wrap(yieldToken).forge(),
        ]);

        const forge = this.contractFactory.pendleForge({ address: forgeAddress, network: this.network });
        const forgeId = await multicall.wrap(forge).forgeId();

        const ownershipTokenAddress = await multicall.wrap(pendleData).otTokens(forgeId, baseTokenAddress, expiry);

        return {
          address: yieldTokenAddress.toLowerCase(),
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
    return this.contractFactory.pendleYieldToken({ address, network: this.network });
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PendleYieldToken>) {
    return [{ address: await contract.underlyingAsset(), network: this.network }];
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
    tokenLoader,
  }: GetPricePerShareParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>) {
    const market = this.contractFactory.pendleMarket({ address: definition.marketAddress, network: this.network });
    const { expiry, baseTokenAddress } = definition;

    const baseToken = await tokenLoader.getOne({ address: baseTokenAddress.toLowerCase(), network: this.network });
    if (!baseToken || Date.now() / 1000 > Number(expiry)) return [0];

    const reserves = await multicall.wrap(market).getReserves();

    const price = new BigNumber(10)
      .pow(appToken.decimals - baseToken.decimals)
      .times(reserves.tokenBalance.toString())
      .times(reserves.xytWeight.toString())
      .div(reserves.tokenWeight.toString())
      .div(reserves.xytBalance.toString())
      .times(baseToken.price)
      .toNumber();

    return [price / appToken.tokens[0].price];
  }

  async getDataProps(
    params: GetDataPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>,
  ) {
    const defaultDataProps = await super.getDataProps(params);
    const { marketAddress, expiry, baseTokenAddress } = params.definition;
    return { ...defaultDataProps, marketAddress, baseTokenAddress, expiry };
  }

  async getLabel({
    appToken,
    definition,
    tokenLoader,
  }: GetDisplayPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>) {
    const baseToken = await tokenLoader.getOne({ address: definition.baseTokenAddress, network: this.network });
    return `YT ${getLabelFromToken(appToken.tokens[0])}${baseToken ? ` - ${baseToken.symbol}` : ''}`;
  }

  async getTertiaryLabel({
    appToken,
  }: GetDisplayPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>): Promise<
    string | number | DollarDisplayItem | PercentageDisplayItem | undefined
  > {
    const { expiry } = appToken.dataProps;
    return `Expires ${unix(expiry).format('LL')}`;
  }
}
