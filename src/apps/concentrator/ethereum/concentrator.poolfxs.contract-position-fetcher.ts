import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { IMulticallWrapper } from '~multicall';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { ConcentratorContractFactory, AladdinConcentratorAfxsVault } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorAfxsVaultContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorAfxsVault> {
  groupLabel = 'aFXS Vaults';

  chefAddress = '0xd6e3bb7b1d6fa75a71d48cfb10096d59abbf99e1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinConcentratorAfxsVault {
    return this.contractFactory.aladdinConcentratorAfxsVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorAfxsVault): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorAfxsVault, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(
    contract: AladdinConcentratorAfxsVault,
    _poolIndex: number,
    multicall: IMulticallWrapper,
  ) {
    return multicall.wrap(contract).aladdinFXS();
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
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAfxsVault>) {
    const poolIndex = contractPosition.dataProps.poolIndex;
    return contract.pendingReward(poolIndex, address);
  }
}
