import { Inject } from '@nestjs/common';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { YearnContractFactory } from '../contracts';
import { YearnGovernance } from '../contracts/ethers/YearnGovernance';

@PositionTemplate()
export class EthereumYearnGovernanceContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<YearnGovernance> {
  groupLabel = 'Governance';

  isExcludedFromExplore = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnGovernance {
    return this.contractFactory.yearnGovernance({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0xba37b002abafdd8e89a1995da52740bbc013d992',
        stakedTokenAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
        rewardTokenAddresses: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8'],
      },
    ];
  }

  async getRewardRates({ contract }: GetDataPropsParams<YearnGovernance>) {
    return contract.rewardRate();
  }

  async getActivePeriod({ contract }: GetDataPropsParams<YearnGovernance>): Promise<boolean> {
    const periodFinishRaw = await contract.periodFinish();
    const epochNow = moment().unix();
    const periodFinish = Number(periodFinishRaw);

    return epochNow < periodFinish ? true : false;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<YearnGovernance>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<YearnGovernance>) {
    return contract.rewards(address);
  }
}
