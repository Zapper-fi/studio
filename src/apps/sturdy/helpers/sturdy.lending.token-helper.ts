import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';

import {
  AaveV2LendingTokenHelper,
  AaveV2LendingTokenHelperParams,
} from '~apps/aave-v2/helpers/aave-v2.lending.token-helper';

import { SturdyContractFactory, SturdyLendingPool } from '../contracts';

type SturdyLendingTokenHelperParams = Pick<
  AaveV2LendingTokenHelperParams<SturdyLendingPool>,
  | 'appId'
  | 'groupId'
  | 'network'
  | 'protocolDataProviderAddress'
  | 'isDebt'
  | 'resolveTokenAddress'
  | 'resolveLendingRate'
  | 'resolveLabel'
  | 'resolveApyLabel'
>;

@Injectable()
export class SturdyLendingTokenHelper {
  constructor(
    @Inject(AaveV2LendingTokenHelper) private readonly aaveV2LendingTokenHelper: AaveV2LendingTokenHelper,
    @Inject(SturdyContractFactory) private readonly contractFactory: SturdyContractFactory,
  ) {}

  async getPositions({
    appId,
    groupId,
    network,
    protocolDataProviderAddress,
    isDebt,
    resolveTokenAddress,
    resolveLendingRate,
    resolveLabel,
    resolveApyLabel,
  }: SturdyLendingTokenHelperParams) {
    return this.aaveV2LendingTokenHelper.getTokens<SturdyLendingPool>({
      appId,
      groupId,
      network,
      protocolDataProviderAddress,
      isDebt,
      resolveContract: ({ address }) => this.contractFactory.sturdyLendingPool({ network, address }),
      resolveReserveTokens: ({ contract }) => contract.getReservesList(),
      resolveReserveTokenAddresses: async ({ contract, multicall, reserveTokenAddress }) =>
        multicall.wrap(contract).getReserveData(reserveTokenAddress),
      resolveReserveData: async ({ contract, multicall, reserveTokenAddress }) => {
        const data = await multicall.wrap(contract).getReserveData(reserveTokenAddress);

        return {
          liquidityRate: data.currentLiquidityRate,
          stableBorrowRate: data.currentStableBorrowRate,
          variableBorrowRate: data.currentVariableBorrowRate,
        };
      },
      resolveReserveConfigurationData: async ({ contract, multicall, reserveTokenAddress }) => {
        const LIQUIDATION_THRESHOLD_MASK = Number('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000ffff');
        const LIQUIDATION_THRESHOLD_START_BIT_POSITION = 16;

        const data = await multicall.wrap(contract).getReserveData(reserveTokenAddress);
        const configurationData = data[0].data as BigNumber;
        if (!configurationData) return { liquidationThreshold: BigNumber.from(0), usageAsCollateralEnabled: false };

        const liquidationThreshold =
          (Number(configurationData) & ~LIQUIDATION_THRESHOLD_MASK) >> LIQUIDATION_THRESHOLD_START_BIT_POSITION;

        return {
          liquidationThreshold: BigNumber.from(liquidationThreshold),
          usageAsCollateralEnabled: liquidationThreshold > 0,
        };
      },
      resolveTokenAddress,
      resolveLendingRate,
      resolveLabel,
      resolveApyLabel,
    });
  }
}
