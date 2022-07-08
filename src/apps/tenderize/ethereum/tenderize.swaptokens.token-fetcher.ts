import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TenderizeContractFactory } from '../contracts';
import { ethereumEndpoint } from '../helpers/constants';
import { ConfigResponse, configQuery } from '../helpers/queries';
import { TENDERIZE_DEFINITION } from '../tenderize.definition';

const appId = TENDERIZE_DEFINITION.id;
const groupId = TENDERIZE_DEFINITION.groups.swaptokens.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumTenderizeSwapTokensTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TenderizeContractFactory) private readonly tenderizeContractFactory: TenderizeContractFactory,
  ) {}

  async getPosition(address: string, steak: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.tenderizeContractFactory.erc20({ address, network });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(v => v.address === steak)!;
    const [symbol, decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    const supply = Number(totalSupply) / 10 ** decimals;
    const price = underlyingToken.price;
    const token: AppTokenPosition = {
      address,
      network,
      appId,
      groupId,
      symbol,
      decimals,
      supply,
      tokens: [],
      dataProps: {},
      pricePerShare: 1,
      price,
      type: ContractType.APP_TOKEN,
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(price),
        images: [],
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
      data.configs.map(async config => await this.getPosition(config.lpToken, config.steak)),
    );
    return positions;
  }
}
