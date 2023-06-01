import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { MetavaultTradeContractFactory, MetavaultTradeRewardTracker } from '../contracts';

type MetavaultTradeFarmType = {
  address: string;
  stakedTokenAddress: string;
  rewardTokenAddresses: string[];
  rewardTrackerAddresses: string[];
};

export abstract class MetavaultTradeFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<MetavaultTradeRewardTracker> {
  abstract farms: MetavaultTradeFarmType[];
  abstract readerAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MetavaultTradeContractFactory) protected readonly contractFactory: MetavaultTradeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MetavaultTradeRewardTracker {
    return this.contractFactory.metavaultTradeRewardTracker({ address, network: this.network });
  }

  async getFarmDefinitions() {
    return this.farms;
  }

  async getRewardRates({ contractPosition }: GetDataPropsParams<MetavaultTradeRewardTracker>) {
    return contractPosition.tokens.filter(isClaimable).map(() => 0);
  }

  async getIsActive() {
    return true;
  }

  async getStakedTokenBalance({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MetavaultTradeRewardTracker>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const readerContract = this.contractFactory.metavaultTradeRewardReader({
      address: this.readerAddress,
      network: this.network,
    });

    const depositBalances = await multicall
      .wrap(readerContract)
      .getDepositBalances(address, [stakedToken.address], [contractPosition.address]);

    return depositBalances[0];
  }

  async getRewardTokenBalances({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MetavaultTradeRewardTracker>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;

    const farmDefinition = this.farms.find(v => v.stakedTokenAddress === stakedToken.address);
    const rewardTrackers = farmDefinition?.rewardTrackerAddresses ?? [];
    if (!rewardTrackers.length) return [];

    const readerContract = this.contractFactory.metavaultTradeRewardReader({
      address: this.readerAddress,
      network: this.network,
    });
    const stakingInfo = await multicall.wrap(readerContract).getStakingInfo(address, rewardTrackers);
    return [stakingInfo[0].toString(), stakingInfo[5].toString()];
  }
}
