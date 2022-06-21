import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { AaveProtocolDataProvider, AaveV2ContractFactory } from '../contracts';

type ReserveTokenAddressesData = {
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
};

type ReserveData = {
  liquidityRate: BigNumber;
  stableBorrowRate: BigNumber;
  variableBorrowRate: BigNumber;
};

type ReserveConfigurationData = {
  usageAsCollateralEnabled: boolean;
  liquidationThreshold: BigNumber;
};

export type AaveV2LendingTokenDataProps = ExchangeableAppTokenDataProps & {
  apy: number;
  enabledAsCollateral: boolean;
  liquidity: number;
  liquidationThreshold: number;
};

export type AaveV2LendingTokenHelperParams<T = AaveProtocolDataProvider> = {
  appId: string;
  groupId: string;
  network: Network;
  protocolDataProviderAddress: string;
  isDebt?: boolean;
  dependencies?: AppGroupsDefinition[];
  resolveContract?: (opts: { contractFactory: AaveV2ContractFactory; address: string }) => T;
  resolveReserveTokens?: (opts: { contract: T }) => Promise<string[]>;
  resolveReserveTokenAddresses?: (opts: {
    contract: T;
    multicall: Multicall;
    reserveTokenAddress: string;
  }) => Promise<ReserveTokenAddressesData>;
  resolveReserveData?: (opts: {
    contract: T;
    multicall: Multicall;
    reserveTokenAddress: string;
  }) => Promise<ReserveData>;
  resolveReserveConfigurationData?: (opts: {
    contract: T;
    multicall: Multicall;
    reserveTokenAddress: string;
  }) => Promise<ReserveConfigurationData>;
  exchangeable?: boolean;
  resolveTokenAddress: (opts: { reserveTokenAddressesData: ReserveTokenAddressesData }) => string;
  resolveLendingRate: (opts: { reserveData: ReserveData }) => BigNumber;
  resolveLabel: (opts: { reserveToken: Token }) => string;
  resolveApyLabel: (opts: { apy: number }) => string;
};

@Injectable()
export class AaveV2LendingTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AaveV2ContractFactory) private readonly contractFactory: AaveV2ContractFactory,
  ) {}

  async getTokens<T = AaveProtocolDataProvider>({
    appId,
    groupId,
    network,
    dependencies = [],
    protocolDataProviderAddress,
    isDebt = false,
    resolveTokenAddress,
    resolveLendingRate,
    resolveLabel,
    resolveApyLabel,
    exchangeable,
    resolveContract = ({ contractFactory, address }) =>
      contractFactory.aaveProtocolDataProvider({ network, address }) as unknown as T,
    resolveReserveTokens = ({ contract }) =>
      (contract as unknown as AaveProtocolDataProvider).getAllReservesTokens().then(v => v.map(t => t[1])),
    resolveReserveTokenAddresses = ({ contract, multicall, reserveTokenAddress }) =>
      multicall.wrap(contract as unknown as AaveProtocolDataProvider).getReserveTokensAddresses(reserveTokenAddress),
    resolveReserveData = ({ contract, multicall, reserveTokenAddress }) =>
      multicall.wrap(contract as unknown as AaveProtocolDataProvider).getReserveData(reserveTokenAddress),
    resolveReserveConfigurationData = ({ contract, multicall, reserveTokenAddress }) =>
      multicall.wrap(contract as unknown as AaveProtocolDataProvider).getReserveConfigurationData(reserveTokenAddress),
  }: AaveV2LendingTokenHelperParams<T>): Promise<AppTokenPosition<AaveV2LendingTokenDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];
    const contract = resolveContract({ contractFactory: this.contractFactory, address: protocolDataProviderAddress });
    const reserveTokens = await resolveReserveTokens({ contract: contract });
    const reserveTokenAddresses = reserveTokens.map(v => v.toLowerCase());

    const tokens = await Promise.all(
      reserveTokenAddresses.map(async reserveTokenAddress => {
        const reserveTokenAddressesData = await resolveReserveTokenAddresses({
          multicall,
          contract: contract,
          reserveTokenAddress,
        });

        const tokenAddress = resolveTokenAddress({ reserveTokenAddressesData }).toLowerCase();
        const reserveToken = allTokens.find(v => v.address === reserveTokenAddress);
        if (!reserveToken) return null;

        const [symbol, decimalsRaw, supplyRaw, reserveData, reserveConfigurationData] = await Promise.all([
          multicall.wrap(this.appToolkit.globalContracts.erc20({ network, address: tokenAddress })).symbol(),
          multicall.wrap(this.appToolkit.globalContracts.erc20({ network, address: tokenAddress })).decimals(),
          multicall.wrap(this.appToolkit.globalContracts.erc20({ network, address: tokenAddress })).totalSupply(),
          resolveReserveData({ contract, multicall, reserveTokenAddress }),
          resolveReserveConfigurationData({ contract, multicall, reserveTokenAddress }),
        ]);

        // Data Props
        const decimals = Number(decimalsRaw);
        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = 1; // Minted 1:1
        const price = pricePerShare * reserveToken.price;
        const liquidityAmount = price * supply;
        const liquidity = isDebt == true ? -liquidityAmount : liquidityAmount;
        const lendingRateRaw = resolveLendingRate({ reserveData });
        const apy = Number(lendingRateRaw) / 10 ** 27;
        const liquidationThresholdRaw = reserveConfigurationData.liquidationThreshold;
        const liquidationThreshold = Number(liquidationThresholdRaw) / 10 ** 4;
        const enabledAsCollateral = reserveConfigurationData.usageAsCollateralEnabled;
        const tokens = [reserveToken];
        const dataProps = {
          apy,
          exchangeable: exchangeable ?? false,
          enabledAsCollateral,
          liquidity,
          liquidationThreshold,
          isActive: Boolean(liquidityAmount > 0),
        };

        // Display Props
        const label = resolveLabel({ reserveToken });
        const secondaryLabel = buildDollarDisplayItem(reserveToken.price);
        const tertiaryLabel = resolveApyLabel({ apy });
        const images = getImagesFromToken(reserveToken);
        const statsItems = [
          { label: 'APY', value: buildPercentageDisplayItem(apy) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        const token: AppTokenPosition<AaveV2LendingTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: tokenAddress,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,
          dataProps,
          displayProps: {
            label,
            secondaryLabel,
            tertiaryLabel,
            images,
            statsItems,
          },
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
