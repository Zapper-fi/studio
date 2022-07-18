import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TenderizeContractFactory } from '../contracts';
import { arbitrumEndpoint } from '../helpers/constants';
import { tenderTokenFetcherQuery, TenderTokenFetcherResponse } from '../helpers/queries';
import { APYResponse } from '../helpers/types';
import { TENDERIZE_DEFINITION } from '../tenderize.definition';

const appId = TENDERIZE_DEFINITION.id;
const groupId = TENDERIZE_DEFINITION.groups.tender.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumTenderizeTenderTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TenderizeContractFactory) private readonly tenderizeContractFactory: TenderizeContractFactory,
  ) {}

  async getPosition(address: string, steak: string, virtualPrice: string, apy: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.tenderizeContractFactory.erc20({ address, network });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(v => v.address === steak)!;
    if (!underlyingToken) return null;

    const [symbol, decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const tokens = [underlyingToken];
    const supply = Number(totalSupply) / 10 ** decimals;
    const pricePerShare = Number(virtualPrice) / 10 ** decimals;
    const price = underlyingToken.price * pricePerShare;

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
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(price),
        tertiaryLabel: `${apy}% APY`,
        images: getImagesFromToken(underlyingToken),
        statsItems: [],
      },
    };

    return token;
  }

  async getPositions() {
    const data = await this.appToolkit.helpers.theGraphHelper.request<TenderTokenFetcherResponse>({
      endpoint: arbitrumEndpoint,
      query: tenderTokenFetcherQuery,
    });

    const { data: apyData } = await Axios.get<APYResponse>('https://www.tenderize.me/api/apy');
    const apyArr = Object.values(apyData);

    const positions = await Promise.all(
      data.configs.map(async config => {
        const apy = apyArr.find(item => item.subgraphId === config.id)?.apy;
        const virtualPrice =
          data.tenderSwaps.find(item => item.id === config.id)?.virtualPrice ?? '1000000000000000000';
        return await this.getPosition(config.tenderToken, config.steak, virtualPrice, apy ?? '0');
      }),
    );

    return compact(positions);
  }
}
