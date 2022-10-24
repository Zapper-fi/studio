import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PlutusContractFactory, PlutusFarmPls } from '../contracts';

@PositionTemplate()
export class ArbitrumPlutusFarmPlsContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PlutusFarmPls> {
  groupLabel = 'PLS Farm';
  chefAddress = '0x5593473e318f0314eb2518239c474e183c4cbed5';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPls {
    return this.contractFactory.plutusFarmPls({ address, network: this.network });
  }

  async getPoolLength(contract: PlutusFarmPls): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PlutusFarmPls, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(x => x.lpToken);
  }

  async getRewardTokenAddress(contract: PlutusFarmPls): Promise<string> {
    return contract.PLS();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PlutusFarmPls>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PlutusFarmPls>): Promise<BigNumberish> {
    return contract.plsPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<PlutusFarmPls>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetMasterChefTokenBalancesParams<PlutusFarmPls>): Promise<BigNumberish> {
    return contract.userInfo(0, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
  }: GetMasterChefTokenBalancesParams<PlutusFarmPls>): Promise<BigNumberish> {
    return contract.pendingPls(0, address);
  }
}
