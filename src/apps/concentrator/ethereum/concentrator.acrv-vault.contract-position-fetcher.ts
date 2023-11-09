import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { IMulticallWrapper } from '~multicall';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { ConcentratorViemContractFactory } from '../contracts';
import { AladdinConcentratorAcrvVault } from '../contracts/viem';

@PositionTemplate()
export class EthereumConcentratorAcrvVaultContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorAcrvVault> {
  groupLabel = 'aCRV Vaults';

  chefAddress = '0x3cf54f3a1969be9916dad548f3c084331c4450b5';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorViemContractFactory) protected readonly contractFactory: ConcentratorViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.aladdinConcentratorAcrvVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorAcrvVault): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorAcrvVault, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([poolIndex]).then(v => v.lpToken);
  }

  async getRewardTokenAddress(
    contract: AladdinConcentratorAcrvVault,
    _poolIndex: number,
    multicall: IMulticallWrapper,
  ) {
    return Promise.all([multicall.wrap(contract).read.ctr(), multicall.wrap(contract).read.aladdinCRV()]);
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
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAcrvVault>) {
    return contract.read.userInfo([contractPosition.dataProps.poolIndex, address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAcrvVault>) {
    const poolIndex = contractPosition.dataProps.poolIndex;
    const ctrBalanceRaw = await contract.read.pendingCTR([poolIndex, address]);
    const aCrvBalanceRaw = await contract.read.pendingReward([poolIndex, address]);
    return [ctrBalanceRaw, aCrvBalanceRaw];
  }
}
