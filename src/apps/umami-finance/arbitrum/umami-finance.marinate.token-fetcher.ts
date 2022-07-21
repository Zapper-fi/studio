import { Inject } from '@nestjs/common';
import axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { UmamiFinanceContractFactory } from '../contracts';
import { UMAMI_FINANCE_DEFINITION } from '../umami-finance.definition';

const appId = UMAMI_FINANCE_DEFINITION.id;
const groupId = UMAMI_FINANCE_DEFINITION.groups.marinate.id;
const network = Network.ARBITRUM_MAINNET;

type UmamiMarinateApiObject = {
  apr: string;
  marinateTVL: string;
};

export type UmamiApiDatas = {
  marinate: UmamiMarinateApiObject;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumUmamiMarinateTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceContractFactory) private readonly contractFactory: UmamiFinanceContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${network}:${appId}:${groupId}:informations`,
    timeout: 5 * 60 * 1000,
  })
  async getUmamiInformations() {
    try {
      const data = await axios.get<UmamiApiDatas>('https://horseysauce.xyz/').then(v => v.data);
      return Number(data.marinate.apr);
    } catch (err) {
      return 0;
    }
  }

  async getPositions() {
    const UMAMI_ADDRESS = '0x1622bf67e6e5747b81866fe0b85178a93c7f86e3'.toLowerCase();
    const M_UMAMI_ADDRESS = '0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4'.toLowerCase();
    const multicall = this.appToolkit.getMulticall(network);

    const contract = this.contractFactory.umamiFinanceMarinate({
      address: M_UMAMI_ADDRESS,
      network,
    });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    const supply = Number(supplyRaw) / 10 ** decimals;

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokenDependencies.find(v => v.address === UMAMI_ADDRESS);
    if (!underlyingToken) return [];

    const apr = await this.getUmamiInformations();
    const tokens = [underlyingToken];
    const pricePerShare = 1.0;
    const price = pricePerShare * underlyingToken.price;
    const liquidity = supply * price;
    const label = `Marinating UMAMI`;
    const images = getImagesFromToken(underlyingToken);
    const secondaryLabel = buildDollarDisplayItem(price);

    const statsItems = [
      {
        label: 'Liquidity',
        value: buildDollarDisplayItem(liquidity),
      },
      {
        label: 'APR',
        value: buildPercentageDisplayItem(apr),
      },
    ];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: M_UMAMI_ADDRESS,
      network,
      symbol,
      decimals,
      supply,
      pricePerShare,
      price,
      tokens,
      dataProps: {
        liquidity,
      },
      displayProps: {
        label,
        images,
        secondaryLabel,
        statsItems,
      },
    };
    return [token];
  }
}
