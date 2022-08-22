import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { MasterChefTemplateContractPositionFetcher } from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { StargateChef, StargateContractFactory } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumStargateFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<StargateChef> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0xea8dfee1898a7e0a59f7527f076106d7e44c2176';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) protected readonly contractFactory: StargateContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StargateChef {
    return this.contractFactory.stargateChef({ address, network: this.network });
  }

  async getPoolLength(contract: StargateChef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: StargateChef, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: StargateChef): Promise<string> {
    return contract.stargate();
  }

  async getTotalAllocPoints(contract: StargateChef): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate(contract: StargateChef): Promise<BigNumberish> {
    return contract.stargatePerBlock();
  }

  async getPoolAllocPoints(contract: StargateChef, poolIndex: number): Promise<BigNumberish> {
    return contract.poolInfo(poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance(address: string, contract: StargateChef, poolIndex: number): Promise<BigNumberish> {
    return contract.userInfo(poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, contract: StargateChef, poolIndex: number): Promise<BigNumberish> {
    return contract.pendingStargate(poolIndex, address);
  }
}
