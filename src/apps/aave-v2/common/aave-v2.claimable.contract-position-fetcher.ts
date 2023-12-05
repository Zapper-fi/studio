import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { AaveV2ViemContractFactory } from '../contracts';
import { AaveStakedTokenIncentivesController } from '../contracts/viem';

export type AaveV2ClaimableDataProps = {
  incentivesControllerAddress: string;
  protocolDataProviderAddress: string;
};

export abstract class AaveV2ClaimablePositionFetcher extends ContractPositionTemplatePositionFetcher<
  AaveStakedTokenIncentivesController,
  AaveV2ClaimableDataProps
> {
  abstract incentivesControllerAddress: string;
  abstract protocolDataProviderAddress: string;
  abstract rewardTokenAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveV2ViemContractFactory) protected readonly contractFactory: AaveV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return [{ address: this.incentivesControllerAddress }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: this.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<AaveStakedTokenIncentivesController, AaveV2ClaimableDataProps>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  getContract(address: string) {
    return this.contractFactory.aaveStakedTokenIncentivesController({ address, network: this.network });
  }

  async getSecondaryLabel(
    params: GetDisplayPropsParams<AaveStakedTokenIncentivesController, AaveV2ClaimableDataProps>,
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
  }: GetTokenBalancesParams<AaveStakedTokenIncentivesController, AaveV2ClaimableDataProps>): Promise<BigNumberish[]> {
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
    const reserveTokens = await lendingContract.read.getAllReservesTokens();
    const reserveTokenAddresses = reserveTokens.map(v => v.tokenAddress.toLowerCase());
    const tokenAddresses = await Promise.all(
      reserveTokenAddresses.map(async reserveTokenAddress => {
        const tokenAddresses = await lendingContract.read.getReserveTokensAddresses([reserveTokenAddress]);

        return [tokenAddresses[0].toLowerCase(), tokenAddresses[1].toLowerCase(), tokenAddresses[2].toLowerCase()];
      }),
    );

    // Retrieve emissions for each token address
    const tokenAddressesFlat = tokenAddresses.flat();
    const tokenEmissionsPerSecond = await Promise.all(
      tokenAddressesFlat.map(async reserveTokenAddress => {
        const assetDetails = await contract.read.assets([reserveTokenAddress]);
        return Number(assetDetails[0]);
      }),
    );

    // For assets earning non-zero emissions, retrieve claimable balances
    const earningAddresses = tokenAddressesFlat.filter((_, i) => tokenEmissionsPerSecond[i] > 0);
    const balanceRaw = await contract.read.getRewardsBalance([earningAddresses, address]);
    return [balanceRaw];
  }
}
