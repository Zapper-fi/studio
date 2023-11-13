import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { JonesDaoViemContractFactory } from '../contracts';
import { JonesMillinerV2 } from '../contracts/viem';
import { JonesMillinerV2Contract } from '../contracts/viem/JonesMillinerV2';

@PositionTemplate()
export class ArbitrumJonesDaoMillinerV2ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<JonesMillinerV2> {
  groupLabel = 'Farms';
  chefAddress = '0xb94d1959084081c5a11c460012ab522f5a0fd756';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoViemContractFactory) protected readonly contractFactory: JonesDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jonesMillinerV2({ address, network: this.network });
  }

  async getPoolLength(contract: JonesMillinerV2Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: JonesMillinerV2Contract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: JonesMillinerV2Contract) {
    return contract.read.jones();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<JonesMillinerV2>) {
    return contract.read.totalAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<JonesMillinerV2>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(i => i[1]);
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<JonesMillinerV2>) {
    return contract.read.jonesPerSecond();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JonesMillinerV2>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JonesMillinerV2>) {
    return contract.read.pendingJones([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
