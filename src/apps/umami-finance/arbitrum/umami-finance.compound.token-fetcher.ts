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
const groupId = UMAMI_FINANCE_DEFINITION.groups.compound.id;
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
export class ArbitrumUmamiFinanceCompoundTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
      return parseFloat(data.marinate.apy);
    } catch (err) {
      return 0;
    }
  }

  async getPositions() {
    const M_UMAMI_ADDESS = '0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4';
    const CM_UMAMI_ADDRESS = '0x1922c36f3bc762ca300b4a46bb2102f84b1684ab';
    const multicall = this.appToolkit.getMulticall(network);

    const underlyingTokenContract = this.contractFactory.umamiFinanceMarinate({
      address: M_UMAMI_ADDESS,
      network,
    });
    const contract = this.contractFactory.umamiFinanceCompound({
      address: CM_UMAMI_ADDRESS,
      network,
    });

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: UMAMI_FINANCE_DEFINITION.id,
      groupIds: [UMAMI_FINANCE_DEFINITION.groups.marinate.id],
      network,
    });

    const [symbol, decimals, supplyRaw, balanceRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
      multicall.wrap(underlyingTokenContract).balanceOf(CM_UMAMI_ADDRESS),
    ]);

    const underlyingToken = appTokens.find(v => v.address === M_UMAMI_ADDESS);
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
        value: buildPercentageDisplayItem(apy),
      },
    ];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: CM_UMAMI_ADDRESS,
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
