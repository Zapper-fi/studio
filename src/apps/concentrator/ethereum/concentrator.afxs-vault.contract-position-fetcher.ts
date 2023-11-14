import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ViemMulticallDataLoader } from '~multicall';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { ConcentratorViemContractFactory } from '../contracts';
import { AladdinConcentratorAfxsVault } from '../contracts/viem';
import { AladdinConcentratorAfxsVaultContract } from '../contracts/viem/AladdinConcentratorAfxsVault';

@PositionTemplate()
export class EthereumConcentratorAfxsVaultContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorAfxsVault> {
  groupLabel = 'aFXS Vaults';

  chefAddress = '0xd6e3bb7b1d6fa75a71d48cfb10096d59abbf99e1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorViemContractFactory) protected readonly contractFactory: ConcentratorViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.aladdinConcentratorAfxsVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorAfxsVaultContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorAfxsVaultContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[4]);
  }

  async getRewardTokenAddress(
    contract: AladdinConcentratorAfxsVaultContract,
    _poolIndex: number,
    multicall: ViemMulticallDataLoader,
  ) {
    return multicall.wrap(contract).read.aladdinFXS();
  }

  async getTotalAllocPoints() {
    return 1;
  }

  async getTotalRewardRate() {
    return 0;
  }

  async getPoolAllocPoints() {
    return 0;
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAfxsVault>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAfxsVault>) {
    const poolIndex = contractPosition.dataProps.poolIndex;
    return contract.read.pendingReward([BigInt(poolIndex), address]);
  }
}
