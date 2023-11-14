import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PenguinViemContractFactory } from '../contracts';
import { PenguinChef } from '../contracts/viem';
import { PenguinChefContract } from '../contracts/viem/PenguinChef';

@PositionTemplate()
export class AvalanchePenguinChefV1FarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PenguinChef> {
  chefAddress = '0x8ac8ed5839ba269be2619ffeb3507bab6275c257';
  groupLabel = 'Farms';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PenguinViemContractFactory) protected readonly contractFactory: PenguinViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.penguinChef({ address, network: this.network });
  }

  async getPoolLength(contract: PenguinChefContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PenguinChefContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: PenguinChefContract): Promise<string> {
    return contract.read.pefi();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.pefiPerBlock();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.pendingPEFI([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
