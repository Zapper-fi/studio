import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PieDaoViemContractFactory } from '../contracts';
import { PieDaoStaking } from '../contracts/viem';
import { PieDaoStakingContract } from '../contracts/viem/PieDaoStaking';

@PositionTemplate()
export class EthereumPieDaoFarmMasterChefContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PieDaoStaking> {
  groupLabel = 'Farms';
  chefAddress = '0x6de77a304609472a4811a0bfd47d8682aebc29df';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PieDaoViemContractFactory) protected readonly contractFactory: PieDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pieDaoStaking({ address, network: this.network });
  }

  async getPoolLength(contract: PieDaoStakingContract) {
    return contract.read.poolCount();
  }

  async getStakedTokenAddress(contract: PieDaoStakingContract, poolIndex: number) {
    return contract.read.getPoolToken([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress(contract: PieDaoStakingContract) {
    return contract.read.reward();
  }

  async getTotalAllocPoints() {
    return 1;
  }

  async getPoolAllocPoints() {
    return 1;
  }

  async getTotalRewardRate({ contract, definition }: GetMasterChefDataPropsParams<PieDaoStaking>) {
    return contract.read.getPoolRewardRate([BigInt(definition.poolIndex)]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PieDaoStaking>) {
    return contract.read.getStakeTotalDeposited([address, BigInt(contractPosition.dataProps.poolIndex)]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PieDaoStaking>) {
    return contract.read.getStakeTotalUnclaimed([address, BigInt(contractPosition.dataProps.poolIndex)]);
  }
}
