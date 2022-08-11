import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { buildDollarDisplayItem } from '../presentation/display-item.present';
import { getTokenImg } from '../presentation/image.present';

type StakedTokenHelperParams = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  underlyingTokenAddress: string;
  exchangeable?: boolean;
  reserveAddress?: string;
  resolvePricePerShare?: (opts: {
    reserve: number;
    supply: number;
    address: string;
    network: Network;
  }) => number | Promise<number>;
  resolveLiquidity?: (opts: { reserve: number; supply: number; price: number }) => number;
  resolveImages?: (opts: { address: string }) => string[];
};

export type StakedTokenDataProps = ExchangeableAppTokenDataProps & {
  liquidity: number;
};

@Injectable()
export class StakedTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens({
    address,
    network,
    appId,
    groupId,
    underlyingTokenAddress,
    reserveAddress,
    exchangeable = false,
    resolvePricePerShare = ({ reserve, supply }) => reserve / supply,
    resolveLiquidity = ({ supply, price }) => supply * price,
    resolveImages = ({ address }) => [getTokenImg(address, network)],
  }: StakedTokenHelperParams) {
    // Supports implementations forked (or similar) to xSUSHI
    const type = ContractType.APP_TOKEN;
    const contractFactory = this.appToolkit.globalContracts;
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    const underlyingToken = await tokenSelector.getOne({ network, address: underlyingTokenAddress });
    if (!underlyingToken) return [];

    const underlyingTokenContract = contractFactory.erc20({ network, address: underlyingToken.address });
    const tokenContract = contractFactory.erc20({ network, address });
    const reserveLocation = reserveAddress ?? address;

    const [decimals, symbol, supplyRaw, reserveRaw] = await Promise.all([
      multicall.wrap(tokenContract).decimals(),
      multicall.wrap(tokenContract).symbol(),
      multicall.wrap(tokenContract).totalSupply(),
      multicall.wrap(underlyingTokenContract).balanceOf(reserveLocation),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    const pricePerShare = await resolvePricePerShare({ reserve, supply, address, network });
    const price = Number(pricePerShare) * underlyingToken.price;
    const liquidity = resolveLiquidity({ reserve, supply, price });

    const tokens = [underlyingToken];

    // Display properties
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = resolveImages({ address: underlyingTokenAddress });
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const stakedToken: AppTokenPosition<StakedTokenDataProps> = {
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
        exchangeable,
      },

      displayProps: {
        label,
        secondaryLabel,
        images,
        statsItems,
      },
    };

    return [stakedToken];
  }
}
