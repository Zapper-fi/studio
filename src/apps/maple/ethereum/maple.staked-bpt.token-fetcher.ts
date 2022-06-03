import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BALANCER_V1_DEFINITION } from '~apps/balancer-v1';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MapleContractFactory } from '../contracts';
import { MAPLE_DEFINITION } from '../maple.definition';

const STAKED_BPT_TOKEN_DEFINITIONS = [
  {
    address: '0x12b2bbbfab2ce6789df5659e9ac27a4a91c96c5c',
    tokenAddress: '0xc1b10e536cd611acff7a7c32a9e29ce6a02ef6ef',
  },
  {
    address: '0xbb7866435b8e5d3f6c2ea8b720c8f79db6f7c1b4',
    tokenAddress: '0xc1b10e536cd611acff7a7c32a9e29ce6a02ef6ef',
  },
  {
    address: '0xd9631f58f3afcd1d0e5863b31c7924a3fb79253d',
    tokenAddress: '0xc1b10e536cd611acff7a7c32a9e29ce6a02ef6ef',
  },
];

const appId = MAPLE_DEFINITION.id;
const groupId = MAPLE_DEFINITION.groups.stakedBpt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumMapleStakedBptTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MapleContractFactory) protected readonly contractFactory: MapleContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: BALANCER_V1_DEFINITION.id,
      groupIds: [BALANCER_V1_DEFINITION.groups.pool.id],
      network,
    });

    const mplUsdcAppTokenAddress = '0xc1b10e536cd611acff7a7c32a9e29ce6a02ef6ef';
    const mplUsdcAppToken = appTokens.find(m => m.address == mplUsdcAppTokenAddress);
    if (!mplUsdcAppToken) return [];

    const vaultTokens = await Promise.all(
      STAKED_BPT_TOKEN_DEFINITIONS.map(async ({ address }) => {
        const contract = this.contractFactory.erc20({ address, network });

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = 1;
        const price = mplUsdcAppToken.price;
        const tokens = [mplUsdcAppToken];

        // Display Props
        const label = `Staked ${getLabelFromToken(mplUsdcAppToken)}`;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = mplUsdcAppToken.displayProps.images;

        const vaultToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply,
          pricePerShare,
          price,
          tokens,

          dataProps: {},

          displayProps: {
            label,
            secondaryLabel,
            images,
          },
        };

        return vaultToken;
      }),
    );

    return compact(vaultTokens);
  }
}
