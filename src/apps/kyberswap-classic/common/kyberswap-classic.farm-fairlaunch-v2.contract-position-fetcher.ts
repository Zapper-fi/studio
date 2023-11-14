import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { KyberswapClassicViemContractFactory } from '../contracts';
import { KyberSwapClassicMasterchefV2 } from '../contracts/viem';
import { KyberSwapClassicMasterchefV2Contract } from '../contracts/viem/KyberSwapClassicMasterchefV2';

export abstract class KyberSwapClassicFarmFairlaunchV2ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<KyberSwapClassicMasterchefV2> {
  abstract chefAddresses: string[];

  // Ignored; Multiple Chefs
  chefAddress = '';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapClassicViemContractFactory)
    protected readonly contractFactory: KyberswapClassicViemContractFactory,
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

  getContract(address: string) {
    return this.contractFactory.kyberSwapClassicMasterchefV2({ address, network: this.network });
  }

  async getPoolLength(contract: KyberSwapClassicMasterchefV2Contract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: KyberSwapClassicMasterchefV2Contract, poolIndex: number): Promise<string> {
    return contract.read.getPoolInfo([BigInt(poolIndex)]).then(v => v[1]);
  }

  async getRewardTokenAddress(contract: KyberSwapClassicMasterchefV2Contract): Promise<string> {
    return contract.read.getRewardTokens().then(v => v[0]);
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
    return contract.read.getPoolInfo([BigInt(definition.poolIndex)]).then(v => v[7][0]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchefV2>): Promise<BigNumberish> {
    return contract.read.getUserInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchefV2>): Promise<BigNumberish> {
    return contract.read.pendingRewards([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }
}
