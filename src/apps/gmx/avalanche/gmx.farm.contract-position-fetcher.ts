import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { GmxContractFactory, GmxRewardTracker } from '../contracts';
import { GMX_DEFINITION } from '../gmx.definition';

export const GMX_FARM = {
  address: '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342',
  stakedTokenAddress: '0x62edc0692bd897d2295872a9ffcac5425011c661',
  rewardTokenAddresses: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', '0xff1489227bbaac61a9209a08929e4c2a526ddd17'],
  rewardTrackerAddresses: ['0x4d268a7d4c16ceb5a606c173bd974984343fea13', '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342'],
};

export const ES_GMX_FARM = {
  address: '0x2bd10f8e93b3669b6d42e74eeedc65dd1b0a1342',
  stakedTokenAddress: '0xff1489227bbaac61a9209a08929e4c2a526ddd17',
  rewardTokenAddresses: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', '0xff1489227bbaac61a9209a08929e4c2a526ddd17'],
  rewardTrackerAddresses: [],
};

export const GLP_FARM = {
  address: '0xd2d1162512f927a7e282ef43a362659e4f2a728f',
  stakedTokenAddress: '0x01234181085565ed162a948b6a5e88758cd7c7b8',
  rewardTokenAddresses: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', '0xff1489227bbaac61a9209a08929e4c2a526ddd17'],
  rewardTrackerAddresses: ['0xd2d1162512f927a7e282ef43a362659e4f2a728f', '0x9e295b5b976a184b14ad8cd72413ad846c299660'],
};

export const FARMS = [GMX_FARM, ES_GMX_FARM, GLP_FARM];

@Injectable()
export class AvalancheGmxFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<GmxRewardTracker> {
  appId = GMX_DEFINITION.id;
  groupId = GMX_DEFINITION.groups.farm.id;
  network = Network.AVALANCHE_MAINNET;
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
    const readerAddress = '0x956d63dd6540230487eb7e599ef8b0c6fdca4ab8';
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

    const readerAddress = '0x956d63dd6540230487eb7e599ef8b0c6fdca4ab8';
    const readerContract = this.contractFactory.gmxRewardReader({ address: readerAddress, network: this.network });
    const stakingInfo = await multicall.wrap(readerContract).getStakingInfo(address, rewardTrackers);
    return [stakingInfo[0].toString(), stakingInfo[5].toString()];
  }
}
