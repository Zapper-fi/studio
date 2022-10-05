import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BancorV3ContractFactory, StandardRewards } from '../contracts';

@PositionTemplate()
export class EthereumBancorV3FarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<StandardRewards> {
  chefAddresses = ['0xb0b958398abb0b5db4ce4d7598fb868f5a00f372'];
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ContractFactory) protected readonly contractFactory: BancorV3ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StandardRewards {
    return this.contractFactory.standardRewards({ address, network: this.network });
  }

  async getPoolLength(contract: StandardRewards) {
    return contract.programIds().then(ids => ids.length);
  }

  async getStakedTokenAddress(contract: StandardRewards, poolIndex: number) {
    return contract.programs([poolIndex + 1]).then(v => v[0][2]);
  }

  async getRewardTokenAddress(contract: StandardRewards, poolIndex: number) {
    return contract.programs([poolIndex + 1]).then(v => v[0][3]);
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<StandardRewards>) {
    return 1;
  }

  async getTotalRewardRate(_params: GetMasterChefDataPropsParams<StandardRewards>) {
    return 0;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<StandardRewards>) {
    return 0;
  }

  getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StandardRewards>): Promise<BigNumberish> {
    return contract.providerStake(address, contractPosition.dataProps.poolIndex + 1);
  }

  getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StandardRewards>): Promise<BigNumberish> {
    return contract.pendingRewards(address, [contractPosition.dataProps.poolIndex + 1]);
  }
}
