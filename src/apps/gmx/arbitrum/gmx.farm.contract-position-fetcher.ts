import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { GmxContractFactory, GmxRewardTracker } from '../contracts';
import { GMX_DEFINITION } from '../gmx.definition';

export const GMX_FARM = {
  address: '0x908c4d94d34924765f1edc22a1dd098397c59dd4',
  stakedTokenAddress: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca'],
  rewardTrackerAddresses: ['0xd2d1162512f927a7e282ef43a362659e4f2a728f', '0x908c4d94d34924765f1edc22a1dd098397c59dd4'],
};

export const ES_GMX_FARM = {
  address: '0x908c4d94d34924765f1edc22a1dd098397c59dd4',
  stakedTokenAddress: '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca'],
  rewardTrackerAddresses: [],
};

export const GLP_FARM = {
  address: '0x4e971a87900b931ff39d1aad67697f49835400b6',
  stakedTokenAddress: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca'],
  rewardTrackerAddresses: ['0x4e971a87900b931ff39d1aad67697f49835400b6', '0x1addd80e6039594ee970e5872d247bf0414c8903'],
};

export const FARMS = [GMX_FARM, ES_GMX_FARM, GLP_FARM];

@Injectable()
export class ArbitrumGmxFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<GmxRewardTracker> {
  appId = GMX_DEFINITION.id;
  groupId = GMX_DEFINITION.groups.farm.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Farms';

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
    return FARMS;
  }

  async getRewardRates({ contractPosition }: GetDataPropsParams<GmxRewardTracker>) {
    return contractPosition.tokens.filter(isClaimable).map(() => 0);
  }

  async getStakedTokenBalance({ address, contractPosition, multicall }: GetTokenBalancesParams<GmxRewardTracker>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const readerAddress = '0xe725ad0ce3ecf68a7b93d8d8091e83043ff12e9a';
    const readerContract = this.contractFactory.gmxRewardReader({ address: readerAddress, network: this.network });

    const depositBalances = await multicall
      .wrap(readerContract)
      .getDepositBalances(address, [stakedToken.address], [contractPosition.address]);

    return depositBalances[0];
  }

  async getRewardTokenBalances({ address, contractPosition, multicall }: GetTokenBalancesParams<GmxRewardTracker>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;

    const farmDefinition = FARMS.find(v => v.stakedTokenAddress === stakedToken.address);
    const rewardTrackers = farmDefinition?.rewardTrackerAddresses ?? [];
    if (!rewardTrackers.length) return [];

    const readerAddress = '0xe725ad0ce3ecf68a7b93d8d8091e83043ff12e9a';
    const readerContract = this.contractFactory.gmxRewardReader({ address: readerAddress, network: this.network });
    const stakingInfo = await multicall.wrap(readerContract).getStakingInfo(address, rewardTrackers);
    return [stakingInfo[0].toString(), stakingInfo[5].toString()];
  }
}
