import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory, AladdinConcentratorIfoVault } from '../contracts';

@Injectable()
export class EthereumConcentratorIfoContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConcentratorIfoVault> {
  appId = CONCENTRATOR_DEFINITION.id;
  groupId = CONCENTRATOR_DEFINITION.groups.ifo.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'IFO';

  chefAddress = '0x3cf54f3a1969be9916dad548f3c084331c4450b5';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinConcentratorIfoVault {
    return this.contractFactory.aladdinConcentratorIfoVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConcentratorIfoVault): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConcentratorIfoVault, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: AladdinConcentratorIfoVault, _poolIndex: number, multicall: IMulticallWrapper) {
    return Promise.all([multicall.wrap(contract).ctr(), multicall.wrap(contract).aladdinCRV()]);
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
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorIfoVault>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConcentratorIfoVault>) {
    const poolIndex = contractPosition.dataProps.poolIndex;
    const ctrBalanceRaw = await contract.pendingCTR(poolIndex, address);
    const aCrvBalanceRaw = await contract.pendingReward(poolIndex, address);
    return [ctrBalanceRaw, aCrvBalanceRaw];
  }
}
