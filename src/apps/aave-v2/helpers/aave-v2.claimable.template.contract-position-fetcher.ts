import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';

import { AaveStakedTokenIncentivesController, AaveV2ContractFactory } from '../contracts';

export type AaveV2ClaimableDataProps = {
  incentivesControllerAddress: string;
  protocolDataProviderAddress: string;
};

export abstract class AaveV2ClaimableTemplatePositionFetcher extends ContractPositionTemplatePositionFetcher<
  AaveStakedTokenIncentivesController,
  AaveV2ClaimableDataProps
> {
  abstract incentivesControllerAddress: string;
  abstract protocolDataProviderAddress: string;
  abstract rewardTokenAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveV2ContractFactory) protected readonly contractFactory: AaveV2ContractFactory,
  ) {
    super(appToolkit);
  }

  async getDescriptors() {
    return [{ address: this.incentivesControllerAddress }];
  }

  async getTokenDescriptors() {
    return [{ address: this.rewardTokenAddress, metaType: MetaType.CLAIMABLE }];
  }

  async getLabel(
    params: DisplayPropsStageParams<AaveStakedTokenIncentivesController, AaveV2ClaimableDataProps>,
  ): Promise<string> {
    const rewardToken = params.contractPosition.tokens[0];
    return `Claimable ${rewardToken.symbol}`;
  }

  getContract(address: string) {
    return this.contractFactory.aaveStakedTokenIncentivesController({ address, network: this.network });
  }

  async getSecondaryLabel(
    params: DisplayPropsStageParams<AaveStakedTokenIncentivesController, AaveV2ClaimableDataProps>,
  ): Promise<DisplayProps['secondaryLabel']> {
    const rewardToken = params.contractPosition.tokens[0];
    return buildDollarDisplayItem(rewardToken.price);
  }

  async getDataProps(): Promise<AaveV2ClaimableDataProps> {
    return {
      incentivesControllerAddress: this.incentivesControllerAddress,
      protocolDataProviderAddress: this.protocolDataProviderAddress,
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesPerPositionParams<AaveStakedTokenIncentivesController, AaveV2ClaimableDataProps>): Promise<
    BigNumberish[]
  > {
    // Build contracts for staked token incentives and protocol data provider
    const { dataProps } = contractPosition;
    const { protocolDataProviderAddress } = dataProps;
    const lendingContract = multicall.wrap(
      this.contractFactory.aaveProtocolDataProvider({
        network: this.network,
        address: protocolDataProviderAddress,
      }),
    );

    // Resolve all supply, stable debt, and variable debt token addresses
    const reserveTokens = await lendingContract.getAllReservesTokens();
    const reserveTokenAddresses = reserveTokens.map(v => v[1].toLowerCase());
    const tokenAddresses = await Promise.all(
      reserveTokenAddresses.map(async reserveTokenAddress => {
        const tokenAddresses = await lendingContract.getReserveTokensAddresses(reserveTokenAddress);

        return [
          tokenAddresses.aTokenAddress.toLowerCase(),
          tokenAddresses.stableDebtTokenAddress.toLowerCase(),
          tokenAddresses.variableDebtTokenAddress.toLowerCase(),
        ];
      }),
    );

    // Retrieve emissions for each token address
    const tokenAddressesFlat = tokenAddresses.flat();
    const tokenEmissions = await Promise.all(
      tokenAddressesFlat.map(async reserveTokenAddress => {
        const assetDetails = await contract.assets(reserveTokenAddress);
        return Number(assetDetails.emissionPerSecond);
      }),
    );

    // For assets earning non-zero emissions, retrieve claimable balances
    const earningAddresses = tokenAddressesFlat.filter((_, i) => tokenEmissions[i] > 0);
    const balanceRaw = await contract.getRewardsBalance(earningAddresses, address);
    return [balanceRaw];
  }
}
