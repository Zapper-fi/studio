import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { ConcentratorContractFactory, AladdinConcentratorLegacyVault } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorLegacyVaultContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorLegacyVault> {
  groupLabel = 'Legacy Vaults';

  chefAddress = '0xc8ff37f7d057df1bb9ad681b53fa4726f268e0e8';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinConcentratorLegacyVault {
    return this.contractFactory.aladdinConcentratorLegacyVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorLegacyVault): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorLegacyVault, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
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
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.shares);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorLegacyVault>): Promise<BigNumberish | BigNumberish[]> {
    return contract.pendingReward(contractPosition.dataProps.poolIndex, address);
  }
}
