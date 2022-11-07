import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { QiDaoContractFactory, QiDaoMasterChef } from '../contracts';

@Injectable()
export abstract class QiDaoFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<QiDaoMasterChef> {
  abstract chefAddresses: string[];

  // Ignored; Multiple Chefs
  chefAddress = '';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) protected readonly contractFactory: QiDaoContractFactory,
  ) {
    super(appToolkit);
  }

  // @OVERRIDE
  async getDefinitions() {
    const definitionsAll = await Promise.all(
      this.chefAddresses.map(async chefAddress => {
        const contract = this.getContract(chefAddress);
        const poolLength = await this.getPoolLength(contract);
        return range(0, Number(poolLength)).map(poolIndex => ({ address: this.chefAddress, poolIndex }));
      }),
    );

    return definitionsAll.flat();
  }

  getContract(address: string): QiDaoMasterChef {
    return this.contractFactory.qiDaoMasterChef({ address, network: this.network });
  }

  async getPoolLength(contract: QiDaoMasterChef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: QiDaoMasterChef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: QiDaoMasterChef) {
    return contract.erc20();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<QiDaoMasterChef>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<QiDaoMasterChef>) {
    return contract.rewardPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<QiDaoMasterChef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<QiDaoMasterChef>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<QiDaoMasterChef>): Promise<BigNumberish | BigNumberish[]> {
    return contract.pending(contractPosition.dataProps.poolIndex, address).catch(() => '0');
  }
}
