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
import { AladdinConcentratorAfrxEthVault } from '../contracts/viem';
import { AladdinConcentratorAfrxEthVaultContract } from '../contracts/viem/AladdinConcentratorAfrxEthVault';

@PositionTemplate()
export class EthereumConcentratorAfrxethVaultContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorAfrxEthVault> {
  groupLabel = 'afrxETH Vaults';

  chefAddress = '0x50b47c4a642231dbe0b411a0b2fbc1ebd129346d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorViemContractFactory) protected readonly contractFactory: ConcentratorViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.aladdinConcentratorAfrxEthVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorAfrxEthVaultContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorAfrxEthVaultContract, poolIndex: number): Promise<string> {
    return contract.read.underlying([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress(
    contract: AladdinConcentratorAfrxEthVaultContract,
    _poolIndex: number,
    multicall: ViemMulticallDataLoader,
  ) {
    return multicall.wrap(contract).read.rewardToken();
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
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAfrxEthVault>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAfrxEthVault>) {
    const poolIndex = contractPosition.dataProps.poolIndex;
    return contract.read.pendingReward([BigInt(poolIndex), address]);
  }
}
