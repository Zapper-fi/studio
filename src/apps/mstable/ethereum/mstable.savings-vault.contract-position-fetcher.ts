import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { MstableViemContractFactory } from '../contracts';
import { MstableStaking } from '../contracts/viem';

const SAVINGS_VAULTS = [
  {
    address: '0x78befca7de27d07dc6e71da295cc2946681a6c7b',
    stakedTokenAddress: '0x30647a72dc82d7fbb1123ea74716ab8a317eac19', // imUSD
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
];

@PositionTemplate()
export class EthereumMstableSavingsVaultContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<MstableStaking> {
  groupLabel = 'Savings Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableViemContractFactory) protected readonly contractFactory: MstableViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.mstableStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return SAVINGS_VAULTS;
  }

  getRewardRates({ contract }: GetDataPropsParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<MstableStaking>) {
    return (await contract.read.rewardRate()) > 0;
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<MstableStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
