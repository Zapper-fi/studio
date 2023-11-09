import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { TenderizeViemContractFactory } from '../contracts';
import { TenderFarm } from '../contracts/viem';

import { TenderizeTokenDefinitionsResolver } from './tenderize.token-definition-resolver';

export abstract class FarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  TenderFarm,
  SingleStakingFarmDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TenderizeTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: TenderizeTokenDefinitionsResolver,
    @Inject(TenderizeViemContractFactory) protected readonly contractFactory: TenderizeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.tenderFarm({ network: this.network, address });
  }

  async getFarmDefinitions() {
    const definitions = await this.tokenDefinitionsResolver.getTokenDefinitions(this.network);
    return definitions.map(v => ({
      address: v.tenderFarm,
      stakedTokenAddress: v.lpToken,
      rewardTokenAddresses: [v.tenderToken],
    }));
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<TenderFarm, SingleStakingFarmDataProps>) {
    return contract.read.stakeOf([address]);
  }

  async getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<TenderFarm, SingleStakingFarmDataProps>) {
    return contract.read.availableRewards([address]);
  }

  async getRewardRates({ address }: GetDataPropsParams<TenderFarm, SingleStakingFarmDataProps>) {
    return [await this.tokenDefinitionsResolver.getRewardRate(this.network, address)];
  }

  async getIsActive({ address }: GetDataPropsParams<TenderFarm, SingleStakingFarmDataProps>) {
    return (await this.tokenDefinitionsResolver.getRewardRate(this.network, address)) > 0;
  }
}
