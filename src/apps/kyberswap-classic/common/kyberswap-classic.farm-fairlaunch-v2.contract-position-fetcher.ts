import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { KyberswapClassicContractFactory, KyberSwapClassicMasterchefV2 } from '../contracts';

export abstract class KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<KyberSwapClassicMasterchefV2> {
  abstract chefAddresses: string[];

  // Ignored; Multiple Chefs
  chefAddress = '';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapClassicContractFactory) protected readonly contractFactory: KyberswapClassicContractFactory,
  ) {
    super(appToolkit);
  }

  // @Override
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

  getContract(address: string): KyberSwapClassicMasterchefV2 {
    return this.contractFactory.kyberSwapClassicMasterchefV2({ address, network: this.network });
  }

  async getPoolLength(contract: KyberSwapClassicMasterchefV2): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: KyberSwapClassicMasterchefV2, poolIndex: number): Promise<string> {
    return contract.getPoolInfo(poolIndex).then(v => v.stakeToken);
  }

  async getRewardTokenAddress(contract: KyberSwapClassicMasterchefV2): Promise<string> {
    return contract.getRewardTokens().then(v => v[0]);
  }

  async getTotalAllocPoints(
    _params: GetMasterChefDataPropsParams<KyberSwapClassicMasterchefV2>,
  ): Promise<BigNumberish> {
    return 1;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<KyberSwapClassicMasterchefV2>): Promise<BigNumberish> {
    return 1;
  }

  async getTotalRewardRate({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<KyberSwapClassicMasterchefV2>): Promise<BigNumberish> {
    return contract.getPoolInfo(definition.poolIndex).then(v => v.rewardPerSeconds[0]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchefV2>): Promise<BigNumberish> {
    return contract.getUserInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchefV2>): Promise<BigNumberish> {
    return contract.pendingRewards(contractPosition.dataProps.poolIndex, address).then(v => v[0]);
  }
}
