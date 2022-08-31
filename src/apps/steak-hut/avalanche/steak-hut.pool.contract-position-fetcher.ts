import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { SteakHutPool, SteakHutContractFactory } from '../contracts';
import STEAK_HUT_DEFINITION from '../steak-hut.definition';

const appId = STEAK_HUT_DEFINITION.id;
const groupId = STEAK_HUT_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheSteakHutPoolContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<SteakHutPool> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Pools';
  chefAddress = '0xddbfbd5dc3ba0feb96cb513b689966b2176d4c09';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) protected readonly contractFactory: SteakHutContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SteakHutPool {
    return this.contractFactory.steakHutPool({ address, network: this.network });
  }

  async getPoolLength(contract: SteakHutPool): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: SteakHutPool, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: SteakHutPool): Promise<string> {
    return contract.JOE();
  }

  async getTotalAllocPoints(): Promise<BigNumberish> {
    return 1;
  }

  async getTotalRewardRate(): Promise<BigNumberish> {
    return 0;
  }

  async getPoolAllocPoints(): Promise<BigNumberish> {
    return 0;
  }

  getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SteakHutPool>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SteakHutPool>): Promise<BigNumberish> {
    return contract.pendingJoe(contractPosition.dataProps.poolIndex, address);
  }
}
