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

import { PendleContractFactory } from '../contracts';
import { PendleYieldToken } from '../contracts/ethers/PendleYieldToken';
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
    const _pendleData = this.contractFactory.pendleData({ address: this.pendleDataAddress, network: this.network });
    const pendleData = multicall.wrap(_pendleData);
    const numMarkets = await pendleData.allMarketsLength();

    const definitions = await Promise.all(
      range(0, Number(numMarkets)).map(async i => {
        const marketAddress = await pendleData.allMarkets(i);
        const _market = this.contractFactory.pendleMarket({ address: marketAddress, network: this.network });
        const market = multicall.wrap(_market);
        const address = await market.xyt();
        return { address: address.toLowerCase(), marketAddress: marketAddress.toLowerCase() };
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

    const [expiry, btAddress] = await Promise.all([multicall.wrap(market).expiry(), multicall.wrap(market).token()]);
    const baseToken = await tokenLoader.getOne({ address: btAddress.toLowerCase(), network: this.network });
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
    multicall,
    tokenLoader,
  }: GetDataPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>) {
    const { marketAddress } = definition;
    const market = this.contractFactory.pendleMarket({ address: definition.marketAddress, network: this.network });

    const [expiryRaw, btAddressRaw] = await Promise.all([
      multicall.wrap(market).expiry(),
      multicall.wrap(market).token(),
    ]);

    const baseTokenAddress = btAddressRaw.toLowerCase();
    const baseToken = await tokenLoader.getOne({ address: baseTokenAddress.toLowerCase(), network: this.network });
    const baseTokenSymbol = baseToken?.symbol ?? '';

    const expiry = Number(expiryRaw);
    return { marketAddress, expiry, baseTokenAddress, baseTokenSymbol };
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<PendleYieldToken, PendleYieldTokenDataProps, PendleYieldTokenDefinition>) {
    return `${getLabelFromToken(appToken.tokens[0])} - ${appToken.dataProps.baseTokenSymbol} Yield`;
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
