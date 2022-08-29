import { Inject } from '@nestjs/common';
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

import { PendleContractFactory, PendleOwnershipToken } from '../contracts';
import { PENDLE_DEFINITION } from '../pendle.definition';

const appId = PENDLE_DEFINITION.id;
const groupId = PENDLE_DEFINITION.groups.ownership.id;
const network = Network.ETHEREUM_MAINNET;

export type PendleOwnershipdTokenDataProps = {
  expiry: number;
  marketAddress: string;
  baseTokenAddress: string;
  baseTokenSymbol: string;
};

export type PendleOwnershipTokenDefinition = {
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
export class EthereumPendleOwnershipTokenFetcher extends AppTokenTemplatePositionFetcher<
  PendleOwnershipToken,
  PendleOwnershipdTokenDataProps,
  PendleOwnershipTokenDefinition
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Ownership';
  pendleDataAddress = '0xe8a6916576832aa5504092c1cccc46e3bb9491d6';

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
        const [underlyingAddress, forgeAddress] = await Promise.all([
          multicall.wrap(yieldToken).underlyingAsset(),
          multicall.wrap(yieldToken).forge(),
        ]);

        const forge = this.contractFactory.pendleForge({ address: forgeAddress, network: this.network });
        const forgeId = await multicall.wrap(forge).forgeId();

        const ownershipTokenAddress = await multicall.wrap(pendleData).otTokens(forgeId, baseTokenAddress, expiry);

        return {
          address: ownershipTokenAddress.toLowerCase(),
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
    return this.contractFactory.pendleOwnershipToken({ address, network });
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PendleOwnershipToken>) {
    return contract.underlyingAsset();
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
    tokenLoader,
  }: GetPricePerShareParams<PendleOwnershipToken, PendleOwnershipdTokenDataProps, PendleOwnershipTokenDefinition>) {
    // @TODO
  }

  async getDataProps({
    definition,
    tokenLoader,
  }: GetDataPropsParams<PendleOwnershipToken, PendleOwnershipdTokenDataProps, PendleOwnershipTokenDefinition>) {
    const { marketAddress, baseTokenAddress, expiry } = definition;
    const baseToken = await tokenLoader.getOne({ address: baseTokenAddress.toLowerCase(), network: this.network });
    const baseTokenSymbol = baseToken?.symbol ?? '';
    return { marketAddress, expiry, baseTokenAddress, baseTokenSymbol };
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<PendleOwnershipToken, PendleOwnershipdTokenDataProps, PendleOwnershipTokenDefinition>) {
    return `OT ${getLabelFromToken(appToken.tokens[0])} - ${appToken.dataProps.baseTokenSymbol}`;
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
