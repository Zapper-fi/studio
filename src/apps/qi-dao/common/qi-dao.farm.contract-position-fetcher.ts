import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { QiDaoViemContractFactory } from '../contracts';
import { QiDaoMasterChef } from '../contracts/viem';
import { QiDaoMasterChefContract } from '../contracts/viem/QiDaoMasterChef';

@Injectable()
export abstract class QiDaoFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<QiDaoMasterChef> {
  abstract chefAddresses: string[];

  // Ignored; Multiple Chefs
  chefAddress = '';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoViemContractFactory) protected readonly contractFactory: QiDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  // @OVERRIDE
  async getDefinitions() {
    const definitionsAll = await Promise.all(
      this.chefAddresses.map(async chefAddress => {
        const contract = this.getContract(chefAddress);
        const poolLength = await this.getPoolLength(contract);
        return range(0, Number(poolLength)).map(poolIndex => ({ address: chefAddress, poolIndex }));
      }),
    );

    return definitionsAll.flat();
  }

  getContract(address: string) {
    return this.contractFactory.qiDaoMasterChef({ address, network: this.network });
  }

  async getPoolLength(contract: QiDaoMasterChefContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: QiDaoMasterChefContract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: QiDaoMasterChefContract) {
    return contract.read.erc20();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<QiDaoMasterChef>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<QiDaoMasterChef>) {
    return contract.read.rewardPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<QiDaoMasterChef>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<QiDaoMasterChef>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<QiDaoMasterChef>): Promise<BigNumberish | BigNumberish[]> {
    return contract.read.pending([BigInt(contractPosition.dataProps.poolIndex), address]).catch(() => '0');
  }
}
