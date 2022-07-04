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
import { AppTokenPosition, ExchangeableAppTokenDataProps, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

export type VaultTokenDataProps = ExchangeableAppTokenDataProps & {
  liquidity: number;
  reserve: number;
};

export type VaultTokenHelperParams<T> = {
  /**
   * Network enum for a given vault
   */
  network: Network;
  /**
   * The application id value should match up to the folder name of a given app
   */
  appId: string;
  /**
   * The group id that is defined for a given app. The value should be obtainable within
   * an app's definition file under the groups key.
   */
  groupId: string;
  /**
   * If the vault is dependant on other apps for proper function, then a valid
   * application definition must be passed in.
   */
  dependencies?: AppGroupsDefinition[];
  /**
   * Is this token exchangeable?
   */
  exchangeable?: boolean;
  /**
   * The contract factory which will be leveraged during the entire token retrieval process.
   * Usually, you can use the application specific generated contract factory. The factory
   * is normally stored within an app folder under the `contracts/` sub-folder
   */
  resolveContract: (opts: { address: string; network: Network }) => T;
  /**
   * The address of a vault we wish to retrieve our tokens from.
   * You can either use static string addresses, leverage the multicall function (which should map to the
   * the contract passed in via resolveContract) or other methods (such as an external API call).
   */
  resolveVaultAddresses: (opts: { multicall: EthersMulticall; network: Network }) => string[] | Promise<string[]>;
  /**
   * The address of an underlying token which correponds to a vault deposit.
   * You can either use static string addresses, leverage the multicall function (which should map to the
   * the contract passed in via resolveContract) or other methods (such as an external API call).
   */
  resolveUnderlyingTokenAddress: (opts: { multicall: EthersMulticall; contract: T }) => string | Promise<string | null>;
  /**
   * How do we resolve the reserve (aka: the liquidity or total supply) of a given underlying token.
   */
  resolveReserve: (opts: {
    address: string;
    contract: T;
    multicall: EthersMulticall;
    underlyingToken: Token;
    network: Network;
  }) => number | Promise<number>;
  /**
   * How do we resolve the price of a given share of an underlying token.
   */
  resolvePricePerShare: (opts: {
    contract: T;
    multicall: EthersMulticall;
    underlyingToken: Token;
    reserve: number;
    supply: number;
  }) => number | Promise<number>;
  /**
   * How to retrieve the APY of a given vault.
   * The APY MUST be a value between 1 - 100 and NOT a fractional value.
   * e.g: A value of 6 corresponds to 6%, 42.56 would correspond to 42.56%.
   * If empty, we default to 0
   */
  resolveApy?: (opts: { vaultAddress: string; multicall: EthersMulticall; contract: T }) => Promise<number>;
  /**
   * How do we resolve the label that will be displayed on the frontend.
   * By default, we will use the symbol.
   */
  resolvePrimaryLabel?: (opts: { symbol: string; vaultAddress: string; underlyingToken: Token }) => string;
  /**
   * How do we resolve the images that will be displayed on the frontend.
   * By default, we will attempt to use the underlying token's image.
   */
  resolveImages?: (opts: { underlyingToken: Token }) => string[];
};

@Injectable()
export class VaultTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  /**
   * Retrieve all tokens within a given vault.
   */
  async getTokens<T>({
    network,
    appId,
    groupId,
    dependencies = [],
    exchangeable = false,
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
        const reserve = await resolveReserve({ address: vaultAddress, contract, multicall, underlyingToken, network });
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
            exchangeable,
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
