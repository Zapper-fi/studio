import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import BASTION_PROTOCOL_DEFINITION from '../bastion-protocol.definition';
import { BastionProtocolComptroller, BastionProtocolContractFactory, BastionProtocolCtoken } from '../contracts';

export type BastionLPTokenDataProps = {
  swapAddress: string;
  liquidity: number;
  fee: number;
};

type BastionSupplyTokenHelperParams<T = BastionProtocolComptroller, V = BastionProtocolCtoken> = {
  pools: {
    swapAddress: string;
    lpTokenAddress: string;
    label: string;
  }[];
  isCToken?: boolean; // used to determine how to get the price
  network: Network;
  appId: string;
  groupId: string;
};

@Injectable()
export class BastionSwapTokenHelper {
  constructor(
    @Inject(BastionProtocolContractFactory) private readonly bastionProtocolContractFactory: BastionProtocolContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) { }

  async getTokens<T = BastionProtocolComptroller, V = BastionProtocolCtoken>({
    pools,
    network,
    appId,
    groupId,
  }: BastionSupplyTokenHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [
        BASTION_PROTOCOL_DEFINITION.groups.supply.id,
      ],
      network,
    });
    const poolTokens = await Promise.all(
      pools.map(async pool => {
        const poolContract = this.bastionProtocolContractFactory.bastionProtocolSwap({ address: pool.swapAddress, network });
        const poolTokenContract = this.bastionProtocolContractFactory.bastionProtocolLptoken({ address: pool.lpTokenAddress, network });
        // There's only two tokens on Bastion Stableswap Pools
        const rawTokenAddresses = await Promise.all([
          multicall.wrap(poolContract).getToken(0),
          multicall.wrap(poolContract).getToken(1),
        ]);
        const tokenAddresses = rawTokenAddresses.map(v => (v === ETH_ADDR_ALIAS ? ZERO_ADDRESS : v.toLowerCase()));
        // Again only two tokens
        const reservesRaw = await Promise.all([
          multicall.wrap(poolContract).getTokenBalance(0),
          multicall.wrap(poolContract).getTokenBalance(1),
        ]);

        const maybeTokens = await Promise.all(tokenAddresses.map(async (tokenAddress) => {
          console.log(appTokens)
          const baseToken = baseTokens.find(price => price.address === tokenAddress);
          const appToken = appTokens.find(p => p.address === tokenAddress);
          return appToken ?? baseToken;
        }));

        const tokens = compact(maybeTokens);
        const isMissingUnderlyingTokens = tokens.length !== maybeTokens.length;
        if (isMissingUnderlyingTokens) return null;

        const [symbol, supplyRaw, { swapFee: feeRaw }] = await Promise.all([
          multicall.wrap(poolTokenContract).symbol(),
          multicall.wrap(poolTokenContract).totalSupply(),
          multicall.wrap(poolContract).swapStorage(),
        ]);

        const decimals = 18;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const fee = Number(feeRaw) / 10 ** 10;

        const underlyingTokens = tokens.flatMap(v => (v.type === ContractType.BASE_TOKEN ? v : v.tokens));
        const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** tokens[i].decimals);
        const virtualPriceRaw = await multicall.wrap(poolContract).getVirtualPrice();
        const virtualPrice = Number(virtualPriceRaw) / 10 ** 18;
        const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
        const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
        const price = virtualPrice > 0 ? virtualPrice * (liquidity / supply) : liquidity / supply;
        const pricePerShare = reserves.map(r => r / supply);
        const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);

        // Display Properties
        const secondaryLabel = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');
        const images = underlyingTokens.map(t => getImagesFromToken(t)).flat();

        const lpToken: AppTokenPosition<BastionLPTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: pool.lpTokenAddress,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            swapAddress: pool.swapAddress,
            liquidity,
            fee,
          },

          displayProps: {
            label: pool.label,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
              {
                label: 'Supply',
                value: buildNumberDisplayItem(supply),
              },
              {
                label: 'Fee',
                value: buildPercentageDisplayItem(fee),
              },
            ],
          },
        };

        return lpToken;
      }
      ))
    return compact(poolTokens);
  }
}
