import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { IndexCoopViemContractFactory } from '../contracts';
import { IndexCoopStaking } from '../contracts/viem';

const FARMS = [
  // UNI-V2 DPI / ETH
  {
    address: '0x8f06fba4684b5e0988f215a47775bb611af0f986',
    stakedTokenAddress: '0x4d5ef58aac27d99935e5b6b4a6778ff292059991',
    rewardTokenAddresses: ['0x0954906da0bf32d5479e25f46056d22f08464cab'],
  },
  // UNI-V2 DPI / ETH
  {
    address: '0xb93b505ed567982e2b6756177ddd23ab5745f309',
    stakedTokenAddress: '0x4d5ef58aac27d99935e5b6b4a6778ff292059991',
    rewardTokenAddresses: ['0x0954906da0bf32d5479e25f46056d22f08464cab'],
  },
  // UNI-V2 MVI / ETH
  {
    address: '0x5bc4249641b4bf4e37ef513f3fa5c63ecab34881',
    stakedTokenAddress: '0x4d3c5db2c68f6859e0cd05d080979f597dd64bff',
    rewardTokenAddresses: ['0x0954906da0bf32d5479e25f46056d22f08464cab'],
  },
];

@PositionTemplate()
export class EthereumIndexCoopFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<IndexCoopStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IndexCoopViemContractFactory) protected readonly contractFactory: IndexCoopViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.indexCoopStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<IndexCoopStaking, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<IndexCoopStaking, SingleStakingFarmDataProps>): Promise<boolean> {
    return (await contract.read.rewardRate()).gt(0);
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<IndexCoopStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<IndexCoopStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
