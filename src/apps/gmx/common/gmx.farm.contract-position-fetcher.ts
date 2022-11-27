import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { GmxContractFactory, GmxRewardTracker } from '../contracts';

type GmxFarmType = {
  address: string;
  stakedTokenAddress: string;
  rewardTokenAddresses: string[];
  rewardTrackerAddresses: string[];
};

export abstract class GmxFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<GmxRewardTracker> {
  abstract farms: GmxFarmType[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GmxContractFactory) protected readonly contractFactory: GmxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GmxRewardTracker {
    return this.contractFactory.gmxRewardTracker({ address, network: this.network });
  }

  async getFarmDefinitions() {
    return this.farms;
  }

  async getRewardRates({ contractPosition }: GetDataPropsParams<GmxRewardTracker>) {
    return contractPosition.tokens.filter(isClaimable).map(() => 0);
  }

  async getStakedTokenBalance({ address, contractPosition, multicall }: GetTokenBalancesParams<GmxRewardTracker>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const readerAddress = '0x956d63dd6540230487eb7e599ef8b0c6fdca4ab8';
    const readerContract = this.contractFactory.gmxRewardReader({ address: readerAddress, network: this.network });

    const depositBalances = await multicall
      .wrap(readerContract)
      .getDepositBalances(address, [stakedToken.address], [contractPosition.address]);

    return depositBalances[0];
  }

  async getRewardTokenBalances({ address, contractPosition, multicall }: GetTokenBalancesParams<GmxRewardTracker>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;

    const farmDefinition = this.farms.find(v => v.stakedTokenAddress === stakedToken.address);
    const rewardTrackers = farmDefinition?.rewardTrackerAddresses ?? [];
    if (!rewardTrackers.length) return [];

    const readerAddress = '0x956d63dd6540230487eb7e599ef8b0c6fdca4ab8';
    const readerContract = this.contractFactory.gmxRewardReader({ address: readerAddress, network: this.network });
    const stakingInfo = await multicall.wrap(readerContract).getStakingInfo(address, rewardTrackers);
    return [stakingInfo[0].toString(), stakingInfo[5].toString()];
  }
}
