import { Inject, Injectable } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { MuxContractFactory } from '~apps/mux';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { MUX_DEFINITION } from '../mux.definition';

type GetMuxMlpTokenParams = {
  network: Network;
  mlpTokenAddress: string;
};

type LiquidityAsset = {
  muxLPPrice: number;
  assets: Asset[];
};

type Asset = {
  symbol: string;
  liquidityOnChains: LiquidityOnChains;
};

type LiquidityOnChains = {
  [chainId: string]: {
    value: number;
  };
};

@Injectable()
export class MuxMlpTokenHelper {
  private axios: AxiosInstance = Axios.create({
    baseURL: 'https://app.mux.network',
  });

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly contractFactory: MuxContractFactory,
  ) {}

  async getTokens({ network, mlpTokenAddress }: GetMuxMlpTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const mlpTokenContract = this.contractFactory.erc20({ address: mlpTokenAddress, network });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(mlpTokenContract).symbol(),
      multicall.wrap(mlpTokenContract).decimals(),
      multicall.wrap(mlpTokenContract).totalSupply(),
    ]);

    // Liquidity
    let liquidity = new BigNumber(0);
    const { data: liquidityAsset } = await this.axios.get<LiquidityAsset>('/api/liquidityAsset');
    liquidityAsset.assets.map(asset => {
      const chainId = NETWORK_IDS[network];
      if (chainId) {
        const liq = asset.liquidityOnChains[chainId];
        liquidity = liquidity.plus(liq?.value || 0);
      }
    });
    const liquidityNumber = liquidity.toNumber();
    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = liquidityAsset.muxLPPrice;

    // Display Props
    const imgUrl = 'https://mux-world.github.io/assets/img/tokens/MUXLP.svg';
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [getTokenImg(mlpTokenAddress, network), imgUrl];
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidityNumber) }];

    const mlpToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: mlpTokenAddress,
      appId: MUX_DEFINITION.id,
      groupId: MUX_DEFINITION.groups.mlp.id,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare: [],
      tokens: [],

      dataProps: {
        liquidity: liquidityNumber,
      },

      displayProps: {
        label,
        secondaryLabel,
        images,
        statsItems,
      },
    };

    return [mlpToken];
  }
}
