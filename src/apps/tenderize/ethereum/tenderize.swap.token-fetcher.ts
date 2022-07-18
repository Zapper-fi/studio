import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TenderizeContractFactory } from '../contracts';
import { ethereumEndpoint } from '../helpers/constants';
import { ConfigResponse, configQuery } from '../helpers/queries';
import { TENDERIZE_DEFINITION } from '../tenderize.definition';

const appId = TENDERIZE_DEFINITION.id;
const groupId = TENDERIZE_DEFINITION.groups.swap.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumTenderizeSwapTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TenderizeContractFactory) private readonly tenderizeContractFactory: TenderizeContractFactory,
  ) {}

  async getPosition(address: string, steak: string, tenderAddress: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.tenderizeContractFactory.erc20({ address, network });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(v => v.address === steak)!;
    const tenderTokens = await this.appToolkit.getAppTokenPositions({
      appId: TENDERIZE_DEFINITION.id,
      groupIds: [TENDERIZE_DEFINITION.groups.tender.id],
      network: Network.ETHEREUM_MAINNET,
    });
    const tenderToken = tenderTokens.find(v => v.address === tenderAddress)!;
    if (!underlyingToken || !tenderToken) return null;

    const [symbol, decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const tokens = [tenderToken, underlyingToken];
    const supply = Number(totalSupply) / 10 ** decimals;
    const price = underlyingToken.price;
    const pricePerShare = [0.5, 0.5];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address,
      network,
      appId,
      groupId,
      symbol,
      decimals,
      supply,
      tokens,
      pricePerShare,
      price,
      dataProps: {},
      displayProps: {
        label: `${getLabelFromToken(tenderToken)} / ${getLabelFromToken(underlyingToken)} SWAP`,
        secondaryLabel: buildDollarDisplayItem(price),
        images: [...getImagesFromToken(tenderToken), ...getImagesFromToken(underlyingToken)],
        statsItems: [],
      },
    };

    return token;
  }

  async getPositions() {
    const data = await this.appToolkit.helpers.theGraphHelper.request<ConfigResponse>({
      endpoint: ethereumEndpoint,
      query: configQuery,
    });

    const positions = await Promise.all(
      data.configs.map(async config => await this.getPosition(config.lpToken, config.steak, config.tenderToken)),
    );

    return compact(positions);
  }
}
