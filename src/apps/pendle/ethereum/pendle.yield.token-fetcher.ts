import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';
import moment from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
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
import { Network } from '~types/network.interface';

import { PendleContractFactory, PendleYieldToken } from '../contracts';
import { PENDLE_DEFINITION } from '../pendle.definition';

const appId = PENDLE_DEFINITION.id;
const groupId = PENDLE_DEFINITION.groups.yield.id;
const network = Network.ETHEREUM_MAINNET;

export type PendleYieldTokenDataProps = {
  expiry: number;
  marketAddress: string;
  baseTokenAddress: string;
  baseTokenSymbol: string;
};

export type PendleYieldTokenDefinition = {
  address: string;
  marketAddress: string;
  ownershipTokenAddress: string;
  baseTokenAddress: string;
  yieldTokenAddress: string;
  underlyingAddress: string;
  forgeAddress: string;
  expiry: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPendleYieldTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleYieldToken,
  PendleYieldTokenDataProps,
  PendleYieldTokenDefinition
> {
  appId = appId;
  groupId = groupId;
  network = network;
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
        const [underlyingAddress, forgeAddress] = await Promise.all([
          multicall.wrap(yieldToken).underlyingAsset(),
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
    return this.contractFactory.pendleYieldToken({ address, network });
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PendleYieldToken>) {
    return contract.underlyingAsset();
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
    if (!baseToken || Date.now() / 1000 > Number(expiry)) return 0;

    const reserves = await multicall.wrap(market).getReserves();

    const price = new BigNumber(10)
      .pow(appToken.decimals - baseToken.decimals)
      .times(reserves.tokenBalance.toString())
      .times(reserves.xytWeight.toString())
      .div(reserves.tokenWeight.toString())
      .div(reserves.xytBalance.toString())
      .times(baseToken.price)
      .toNumber();

    return price / appToken.tokens[0].price;
  }

  async getDataProps({
    definition,
    tokenLoader,
  }: GetDataPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>) {
    const { marketAddress, expiry, baseTokenAddress } = definition;
    const baseToken = await tokenLoader.getOne({ address: baseTokenAddress.toLowerCase(), network: this.network });
    const baseTokenSymbol = baseToken?.symbol ?? '';
    return { marketAddress, expiry, baseTokenAddress, baseTokenSymbol };
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>) {
    return `YT ${getLabelFromToken(appToken.tokens[0])} - ${appToken.dataProps.baseTokenSymbol}`;
  }

  async getTertiaryLabel({
    appToken,
  }: GetDisplayPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>): Promise<
    string | number | DollarDisplayItem | PercentageDisplayItem | undefined
  > {
    const { expiry } = appToken.dataProps;
    return `Expires ${moment.unix(expiry).format('LL')}`;
  }
}
