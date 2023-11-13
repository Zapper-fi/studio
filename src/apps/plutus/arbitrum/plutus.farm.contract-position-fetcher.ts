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

import { PlutusViemContractFactory } from '../contracts';
import { PlutusChef } from '../contracts/viem';
import { PlutusChefContract } from '../contracts/viem/PlutusChef';

@PositionTemplate()
export class ArbitrumPlutusFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PlutusChef> {
  chefAddress = '0x5593473e318f0314eb2518239c474e183c4cbed5';
  groupLabel = 'Farms';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusViemContractFactory) protected readonly contractFactory: PlutusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.plutusChef({ address, network: this.network });
  }

  async getPoolLength(contract: PlutusChefContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PlutusChefContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: PlutusChefContract): Promise<string> {
    return contract.read.PLS();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PlutusChef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PlutusChef>): Promise<BigNumberish> {
    return contract.read.plsPerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PlutusChef>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlutusChef>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PlutusChef>): Promise<BigNumberish> {
    return contract.read.pendingPls([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
