import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { TraderJoeViemContractFactory } from '../contracts';
import { TraderJoeVeJoeStaking } from '../contracts/viem';
import { TraderJoeVeJoeStakingContract } from '../contracts/viem/TraderJoeVeJoeStaking';

@PositionTemplate()
export class AvalancheTraderJoeVeJoeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<TraderJoeVeJoeStaking> {
  groupLabel = 'veJOE';
  chefAddress = '0x25d85e17dd9e544f6e9f8d44f99602dbf5a97341';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeViemContractFactory) protected readonly contractFactory: TraderJoeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.traderJoeVeJoeStaking({ address, network: this.network });
  }

  async getPoolLength(_contract: TraderJoeVeJoeStakingContract): Promise<BigNumberish> {
    return 1;
  }

  async getStakedTokenAddress(contract: TraderJoeVeJoeStakingContract) {
    return contract.read.joe();
  }

  async getRewardTokenAddress(contract: TraderJoeVeJoeStakingContract) {
    return contract.read.veJoe();
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<TraderJoeVeJoeStaking>) {
    return 1;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<TraderJoeVeJoeStaking>) {
    return 1;
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeVeJoeStaking>) {
    return contract.read.veJoePerSharePerSec();
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<TraderJoeVeJoeStaking>) {
    return contract.read.userInfos([address]).then(v => v[0]);
  }

  async getRewardTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<TraderJoeVeJoeStaking>) {
    return contract.read.getPendingVeJoe([address]);
  }
}
