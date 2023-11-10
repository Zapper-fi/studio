import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { ConcentratorViemContractFactory } from '../contracts';
import { AladdinConcentratorLegacyVault } from '../contracts/viem';

@PositionTemplate()
export class EthereumConcentratorLegacyVaultContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorLegacyVault> {
  groupLabel = 'Legacy Vaults';

  chefAddress = '0xc8ff37f7d057df1bb9ad681b53fa4726f268e0e8';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorViemContractFactory) protected readonly contractFactory: ConcentratorViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.aladdinConcentratorLegacyVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorLegacyVault): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorLegacyVault, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v.lpToken);
  }

  async getRewardTokenAddress() {
    return '0x2b95a1dcc3d405535f9ed33c219ab38e8d7e0884'; // aCRV
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
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorLegacyVault>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v.shares);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorLegacyVault>): Promise<BigNumberish | BigNumberish[]> {
    return contract.read.pendingReward([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
