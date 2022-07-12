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

import { UmamiContractFactory } from '../contracts';
import { UMAMI_DEFINITION } from '../umami.definition';

const appId = UMAMI_DEFINITION.id;
const groupId = UMAMI_DEFINITION.groups.compound.id;
const network = Network.ARBITRUM_MAINNET;

type UmamiMarinateApiObject = {
  apy: string;
};

type UmamiCompounderApiObject = {
  tvl: number;
};

export type UmamiApiDatas = {
  marinate: UmamiMarinateApiObject;
  mUmamiCompounder: UmamiCompounderApiObject;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumUmamiCompoundTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UmamiContractFactory) private readonly umamiContractFactory: UmamiContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${network}:${appId}:${groupId}:informations`,
    timeout: 15 * 60 * 1000,
  })
  async getUmamiInformations() {
    const data = await axios.get<UmamiApiDatas>('https://horseysauce.xyz/').then(v => v.data);

    const { marinate } = data;
    const { apy } = marinate;
    return apy;
  }

  async getPositions() {
    const mUMAMI_ADDRESS = '0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4';
    const cmUMAMI_ADDRESS = '0x1922c36f3bc762ca300b4a46bb2102f84b1684ab';
    const multicall = this.appToolkit.getMulticall(network);

    const underlyingTokenContract = this.umamiContractFactory.umamiMarinate({
      address: mUMAMI_ADDRESS,
      network,
    });
    const contract = this.umamiContractFactory.umamiCompound({
      address: cmUMAMI_ADDRESS,
      network,
    });

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: UMAMI_DEFINITION.id,
      groupIds: [UMAMI_DEFINITION.groups.marinate.id],
      network,
    });

    const [symbol, decimals, supplyRaw, balanceRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
      multicall.wrap(underlyingTokenContract).balanceOf(cmUMAMI_ADDRESS),
    ]);

    const underlyingToken = appTokens.find(v => v.address === mUMAMI_ADDRESS);
    if (!underlyingToken) return [];

    const apy = await this.getUmamiInformations();

    const supply = Number(supplyRaw) / 10 ** decimals;
    const reserve = Number(balanceRaw) / 10 ** decimals;
    const pricePerShare = reserve / supply;
    const price = pricePerShare * underlyingToken.price;
    const liquidity = supply * price;
    const tokens = [underlyingToken];
    const label = `Compounding Marinating UMAMI`;
    const images = getImagesFromToken(underlyingToken);
    const secondaryLabel = buildDollarDisplayItem(price);

    const statsItems = [
      {
        label: 'Liquidity',
        value: buildDollarDisplayItem(liquidity),
      },
      {
        label: 'APY',
        value: buildPercentageDisplayItem(parseFloat(apy)),
      },
    ];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: cmUMAMI_ADDRESS,
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
