import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { buildDollarDisplayItem } from '../presentation/display-item.present';
import { getTokenImg } from '../presentation/image.present';

type SingleVaultTokenHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  resolveContract: (opts: { address: string; network: Network }) => T;
  resolveUnderlyingTokenAddress: (opts: { contract: T }) => string | Promise<string>;
  resolveReserve?: (opts: { underlyingToken: Token; address: string; network: Network }) => Promise<number>;
  resolvePricePerShare?: (opts: {
    reserve: number;
    supply: number;
    address: string;
    network: Network;
  }) => number | Promise<number>;
  resolveImages?: (opts: { address: string }) => string[];
};

export type SingleVaultTokenDataProps = {
  liquidity: number;
};

@Injectable()
export class SingleVaultTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens<T>({
    address,
    network,
    appId,
    groupId,
    dependencies = [],
    resolveContract,
    resolveUnderlyingTokenAddress,
    resolveReserve = async ({ underlyingToken, address, network }) => {
      const contract = this.appToolkit.globalContracts.erc20({ address: underlyingToken.address, network });
      const reserveRaw = await contract.balanceOf(address);
      return Number(reserveRaw) / 10 ** underlyingToken.decimals;
    },
    resolvePricePerShare = ({ reserve, supply }) => reserve / supply,
    resolveImages = ({ address }) => [getTokenImg(address, network)],
  }: SingleVaultTokenHelperParams<T>) {
    // Supports implementations forked (or similar) to xSUSHI
    const type = ContractType.APP_TOKEN;
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];

    const contract = resolveContract({ address, network });
    const underlyingTokenAddressRaw = await resolveUnderlyingTokenAddress({ contract });
    const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
    const underlyingToken = allTokens.find(p => p.address === underlyingTokenAddress);
    if (!underlyingToken) return [];

    const tokenContract = this.appToolkit.globalContracts.erc20({ network, address });
    const [decimals, symbol, supplyRaw] = await Promise.all([
      multicall.wrap(tokenContract).decimals(),
      multicall.wrap(tokenContract).symbol(),
      multicall.wrap(tokenContract).totalSupply(),
    ]);

    const reserveRaw = await resolveReserve({ underlyingToken, address, network });
    const supply = Number(supplyRaw) / 10 ** decimals;
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    const pricePerShare = await resolvePricePerShare({ reserve, supply, address, network });
    const price = Number(pricePerShare) * underlyingToken.price;
    const liquidity = supply * price;
    const tokens = [underlyingToken];

    // Display properties
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = resolveImages({ address: underlyingTokenAddress });
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const vaultToken: AppTokenPosition<SingleVaultTokenDataProps> = {
      type,
      address,
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
        liquidity,
      },

      displayProps: {
        label,
        secondaryLabel,
        images,
        statsItems,
      },
    };

    return [vaultToken];
  }
}
