import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory, AladdinConvexVault } from '../contracts';

@Injectable()
export class EthereumConcentratorPoolContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AladdinConvexVault> {
  appId = CONCENTRATOR_DEFINITION.id;
  groupId = CONCENTRATOR_DEFINITION.groups.pool.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Farms';

  chefAddress = '0xc8ff37f7d057df1bb9ad681b53fa4726f268e0e8';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinConvexVault {
    return this.contractFactory.aladdinConvexVault({ address, network: this.network });
  }

  async getPoolLength(contract: AladdinConvexVault): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: AladdinConvexVault, poolIndex: number): Promise<string> {
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
  }: GetMasterChefTokenBalancesParams<AladdinConvexVault>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.shares);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AladdinConvexVault>): Promise<BigNumberish | BigNumberish[]> {
    return contract.pendingReward(contractPosition.dataProps.poolIndex, address);
  }
}
