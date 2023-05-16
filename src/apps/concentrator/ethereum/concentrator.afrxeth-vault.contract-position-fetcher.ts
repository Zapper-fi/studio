import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { IMulticallWrapper } from '~multicall';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { ConcentratorContractFactory, AladdinConcentratorAfrxEthVault } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorAfrxethVaultContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorAfrxEthVault> {
  groupLabel = 'afrxETH Vaults';

  chefAddress = '0x50b47c4a642231dbe0b411a0b2fbc1ebd129346d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinConcentratorAfrxEthVault {
    return this.contractFactory.aladdinConcentratorAfrxEthVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorAfrxEthVault): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorAfrxEthVault, poolIndex: number): Promise<string> {
    return contract.underlying(poolIndex);
  }

  async getRewardTokenAddress(
    contract: AladdinConcentratorAfrxEthVault,
    _poolIndex: number,
    multicall: IMulticallWrapper,
  ) {
    return multicall.wrap(contract).rewardToken();
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
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorAfrxEthVault>) {
    const poolIndex = contractPosition.dataProps.poolIndex;
    return contract.pendingReward(poolIndex, address);
  }
}
