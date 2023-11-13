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
import { QiDaoMasterChefV3 } from '../contracts/viem';
import { QiDaoMasterChefV3Contract } from '../contracts/viem/QiDaoMasterChefV3';

@Injectable()
export abstract class QiDaoFarmV3ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<QiDaoMasterChefV3> {
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
    return this.contractFactory.qiDaoMasterChefV3({ address, network: this.network });
  }

  async getPoolLength(contract: QiDaoMasterChefV3Contract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: QiDaoMasterChefV3Contract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: QiDaoMasterChefV3Contract) {
    return contract.read.erc20();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<QiDaoMasterChefV3>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<QiDaoMasterChefV3>) {
    return contract.read.rewardPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<QiDaoMasterChefV3>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<QiDaoMasterChefV3>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<QiDaoMasterChefV3>): Promise<BigNumberish | BigNumberish[]> {
    return contract.read.pending([BigInt(contractPosition.dataProps.poolIndex), address]).catch(() => '0');
  }
}
