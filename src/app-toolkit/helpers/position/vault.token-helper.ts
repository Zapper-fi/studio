import { isPromise } from 'util/types';

import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EthersMulticall } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { StatsItem } from '~position/display.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

export type VaultTokenDataProps = {
  liquidity: number;
  reserve: number;
};

export type VaultTokenHelperParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  resolveContract: (opts: { address: string; network: Network }) => T;
  resolveVaultAddresses: (opts: { multicall: EthersMulticall; network: Network }) => string[] | Promise<string[]>;
  resolveUnderlyingTokenAddress: (opts: { multicall: EthersMulticall; contract: T }) => string | Promise<string | null>;
  resolveReserve: (opts: {
    address: string;
    multicall: EthersMulticall;
    underlyingToken: Token;
    network: Network;
  }) => number | Promise<number>;
  resolvePricePerShare: (opts: {
    multicall: EthersMulticall;
    contract: T;
    reserve: number;
    supply: number;
    underlyingToken: Token;
  }) => number | Promise<number>;
  resolveApy?: (opts: { vaultAddress: string; multicall: EthersMulticall; contract: T }) => Promise<number>;
  resolvePrimaryLabel?: (opts: { symbol: string; vaultAddress: string; underlyingToken: Token }) => string;
  resolveImages?: (opts: { underlyingToken: Token }) => string[];
};

@Injectable()
export class VaultTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens<T>({
    network,
    appId,
    groupId,
    dependencies = [],
    resolveVaultAddresses,
    resolveContract,
    resolveUnderlyingTokenAddress,
    resolveReserve,
    resolvePricePerShare,
    resolveApy,
    resolvePrimaryLabel = ({ symbol }) => symbol,
    resolveImages = ({ underlyingToken }) => getImagesFromToken(underlyingToken),
  }: VaultTokenHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];
    const vaultAddresses = await resolveVaultAddresses({ multicall, network });

    const curvePoolTokens = await Promise.all(
      vaultAddresses.map(async vaultAddress => {
        const type = ContractType.APP_TOKEN;
        const erc20Contract = this.appToolkit.globalContracts.erc20({ address: vaultAddress, network });
        const contract = resolveContract({ address: vaultAddress, network });

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(erc20Contract).symbol(),
          multicall.wrap(erc20Contract).decimals(),
          multicall.wrap(erc20Contract).totalSupply(),
        ]);

        // Find underlying token in dependencies
        const underlyingTokenAddressRawMaybePromise = resolveUnderlyingTokenAddress({ multicall, contract });
        const underlyingTokenAddressRaw = isPromise(underlyingTokenAddressRawMaybePromise)
          ? await underlyingTokenAddressRawMaybePromise.catch(() => null)
          : underlyingTokenAddressRawMaybePromise;
        if (!underlyingTokenAddressRaw) return null;

        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = allTokens.find(p => p.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        // Data props
        const supply = Number(supplyRaw) / 10 ** decimals;
        const reserve = await resolveReserve({ address: vaultAddress, multicall, underlyingToken, network });
        const pricePerShare = await resolvePricePerShare({ multicall, contract, reserve, supply, underlyingToken });
        const apy = resolveApy ? await resolveApy({ multicall, contract, vaultAddress }) : 0;
        const price = underlyingToken.price * pricePerShare;
        const tokens = [underlyingToken];
        const liquidity = price * supply;

        // Display props
        const label = resolvePrimaryLabel({ vaultAddress, symbol, underlyingToken });
        const secondaryLabel = buildDollarDisplayItem(price);
        const tertiaryLabel = resolveApy ? `${(apy * 100).toFixed(3)}% APY` : '';
        const images = resolveImages({ underlyingToken });
        const statsItems: StatsItem[] = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];
        if (reserve > 0) statsItems.push({ label: 'Reserve', value: buildNumberDisplayItem(reserve) });
        if (resolveApy) statsItems.push({ label: 'APY', value: buildPercentageDisplayItem(apy) });

        const vaultToken: AppTokenPosition<VaultTokenDataProps> = {
          type,
          address: vaultAddress,
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
            reserve,
          },

          displayProps: {
            label,
            secondaryLabel,
            tertiaryLabel,
            images,
            statsItems,
          },
        };

        return vaultToken;
      }),
    );

    return compact(curvePoolTokens).filter(v => v.price > 0 && v.supply > 0);
  }
}
