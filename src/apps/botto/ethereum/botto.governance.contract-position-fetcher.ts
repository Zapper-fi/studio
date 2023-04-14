import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmDataProps } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { BottoContractFactory, BottoGovernance } from '../contracts';

@PositionTemplate()
export class EthereumBottoGovernanceContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<BottoGovernance> {
  groupLabel = 'Governance';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BottoContractFactory) protected readonly contractFactory: BottoContractFactory,
  ) {
    super(appToolkit);
  }

  async getFarmDefinitions() {
    return [
      {
        address: '0x19cd3998f106ecc40ee7668c19c47e18b491e8a6',
        stakedTokenAddress: '0x9dfad1b7102d46b1b197b90095b5c4e9f5845bba',
        rewardTokenAddresses: [],
      },
    ];
  }

  getContract(address: string): BottoGovernance {
    return this.contractFactory.bottoGovernance({ address, network: this.network });
  }

  async getRewardRates() {
    return [0];
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BottoGovernance, SingleStakingFarmDataProps>) {
    return contract.userStakes(address);
  }

  async getRewardTokenBalances() {
    return [0];
  }

  async getIsActive() {
    return true;
  }
}
