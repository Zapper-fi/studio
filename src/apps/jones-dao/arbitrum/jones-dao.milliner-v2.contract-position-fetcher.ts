import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { JonesDaoContractFactory, JonesMillinerV2 } from '../contracts';

@PositionTemplate()
export class ArbitrumJonesDaoMillinerV2ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<JonesMillinerV2> {
  groupLabel = 'Farms';
  chefAddress = '0xb94d1959084081c5a11c460012ab522f5a0fd756';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoContractFactory) protected readonly contractFactory: JonesDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jonesMillinerV2({ address, network: this.network });
  }

  async getPoolLength(contract: JonesMillinerV2) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: JonesMillinerV2, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: JonesMillinerV2) {
    return contract.jones();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<JonesMillinerV2>) {
    return contract.totalAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<JonesMillinerV2>) {
    return contract.poolInfo(definition.poolIndex).then(i => i.allocPoint);
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<JonesMillinerV2>) {
    return contract.jonesPerSecond();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JonesMillinerV2>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JonesMillinerV2>) {
    return contract.pendingJones(contractPosition.dataProps.poolIndex, address);
  }
}
