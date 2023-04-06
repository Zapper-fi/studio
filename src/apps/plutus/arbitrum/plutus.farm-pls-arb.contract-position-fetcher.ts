import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PlutusContractFactory, PlutusFarmPlsArb } from '../contracts';

export type PlutusFarmDefinition = SingleStakingFarmDefinition & {
  label: string;
};

@PositionTemplate()
export class ArbitrumPlutusFarmPlsArbContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  PlutusFarmPlsArb,
  SingleStakingFarmDataProps,
  PlutusFarmDefinition
> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPlsArb {
    return this.contractFactory.plutusFarmPlsArb({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<PlutusFarmDefinition[]> {
    return [
      {
        address: '0xcfc273d86333bf453b847d4d8cb7958307d85196',
        stakedTokenAddress: '0x7a5d193fe4ed9098f7eadc99797087c96b002907',
        label: 'plsARB',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
        ],
      },
    ];
  }

  async getRewardRates() {
    return [0];
  }

  async getIsActive() {
    return true;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PlutusFarmPlsArb, SingleStakingFarmDataProps, PlutusFarmDefinition>) {
    return definition.label;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsArb>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsArb>) {
    return contract.pendingRewards(address);
  }
}
