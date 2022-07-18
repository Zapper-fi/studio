import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { NereusFinanceContractFactory } from '../contracts';

import { NereusFinanceClaimableContractPositionDataProps } from './nereus-finance.claimable.contract-position-helper';

type NereusFinanceContractPositionHelperBuildClaimableParams = {
  appId: string;
  groupId: string;
  network: Network;
  address: string;
};

@Injectable()
export class NereusFinanceClaimableBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(NereusFinanceContractFactory) private readonly contractFactory: NereusFinanceContractFactory,
  ) {}

  async getClaimableBalances({
    appId,
    groupId,
    network,
    address,
  }: NereusFinanceContractPositionHelperBuildClaimableParams) {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);

    // Retrieve reward token contract position
    const [contractPosition] =
      await this.appToolkit.getAppContractPositions<NereusFinanceClaimableContractPositionDataProps>({
        network,
        appId,
        groupIds: [groupId],
      });

    // Build contracts for staked token incentives and protocol data provider
    const { dataProps } = contractPosition;
    const { incentivesControllerAddress, protocolDataProviderAddress } = dataProps;
    const incentivesContract = contractFactory.nereusFinanceStakedTokenIncentivesController({
      network,
      address: incentivesControllerAddress,
    });
    const lendingContract = contractFactory.nereusFinanceDataProvider({
      network,
      address: protocolDataProviderAddress,
    });

    // Resolve all supply, stable debt, and variable debt token addresses
    const reserveTokens = await lendingContract.getAllReservesTokens();
    const reserveTokenAddresses = reserveTokens.map(v => v[1].toLowerCase());
    const tokenAddresses = await Promise.all(
      reserveTokenAddresses.map(async reserveTokenAddress => {
        const tokenAddresses = await multicall.wrap(lendingContract).getReserveTokensAddresses(reserveTokenAddress);

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
        const assetDetails = await multicall.wrap(incentivesContract).assets(reserveTokenAddress);
        return Number(assetDetails.emissionPerSecond);
      }),
    );

    // For assets earning non-zero emissions, retrieve claimable balances
    const earningAddresses = tokenAddressesFlat.filter((_, i) => tokenEmissions[i] > 0);
    const balanceRaw = await multicall.wrap(incentivesContract).getRewardsBalance(earningAddresses, address);
    const tokenBalance = drillBalance(contractPosition.tokens[0], balanceRaw.toString());

    const contractPositionBalance: ContractPositionBalance = {
      ...contractPosition,
      tokens: [tokenBalance],
      balanceUSD: tokenBalance.balanceUSD,
    };

    return [contractPositionBalance];
  }
}
