import { Inject } from '@nestjs/common';

import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppToolkit } from '~app-toolkit/app-toolkit.service';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { LooksRareContractFactory, LooksRareFeeSharing } from '../contracts';

const FARMS = [
  {
    address: '0xbcd7254a1d759efa08ec7c3291b2e85c5dcc12ce',
    stakedTokenAddress: '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
    rewardTokenAddresses: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
  },
];

@PositionTemplate()
export class EthereumLooksRareFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<LooksRareFeeSharing> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: AppToolkit,
    @Inject(LooksRareContractFactory) protected readonly contractFactory: LooksRareContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LooksRareFeeSharing {
    return this.contractFactory.looksRareFeeSharing({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<LooksRareFeeSharing, SingleStakingFarmDataProps>) {
    return contract.rewardPerTokenStored();
  }

  getIsActive({ contract }: GetDataPropsParams<LooksRareFeeSharing>) {
    return contract.rewardPerTokenStored().then(v => v.gt(0));
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<LooksRareFeeSharing, SingleStakingFarmDataProps>) {
    return contract.calculateSharesValueInLOOKS(address);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<LooksRareFeeSharing, SingleStakingFarmDataProps>) {
    return contract.calculatePendingRewards(address);
  }
}
