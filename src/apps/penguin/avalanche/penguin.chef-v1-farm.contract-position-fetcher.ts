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

  async getPoolLength(contract: PenguinChef): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PenguinChef, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([poolIndex]).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: PenguinChef): Promise<string> {
    return contract.read.pefi();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.pefiPerBlock();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.poolInfo([definition.poolIndex]).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.userInfo([contractPosition.dataProps.poolIndex, address]).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChef>): Promise<BigNumberish> {
    return contract.read.pendingPEFI([contractPosition.dataProps.poolIndex, address]);
  }
}
