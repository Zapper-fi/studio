import { Inject } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PancakeswapChefV2, PancakeswapContractFactory } from '../contracts';

@PositionTemplate()
export class BinanceSmartChainPancakeSwapBoostedFarmV2ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapChefV2> {
  groupLabel = 'Boosted Farms';
  isExcludedFromTvl = true;

  chefAddress = '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652';
  boosterAddress = '0xe4faa3ef5a9708c894435b0f39c2b440936a3a52';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapChefV2({ address, network: this.network });
  }

  async getDefinitions() {
    const multicall = this.appToolkit.getMulticall(this.network);
    const chefV2 = this.contractFactory.pancakeswapChefV2({ address: this.chefAddress, network: this.network });
    const poolLength = await chefV2.poolLength();

    const booster = this.contractFactory.pancakeswapFarmBooster({
      address: this.boosterAddress,
      network: this.network,
    });

    const boostedPids = await Promise.all(
      range(0, Number(poolLength)).map(async i => {
        const isWhitelisted = await multicall.wrap(booster).whiteList(i);
        return isWhitelisted ? i : null;
      }),
    );

    return compact(boostedPids).map(poolIndex => ({ address: this.chefAddress, poolIndex }));
  }

  async getPoolLength(contract: PancakeswapChefV2) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PancakeswapChefV2, poolIndex: number) {
    return contract.lpToken(poolIndex);
  }

  async getRewardTokenAddress(contract: PancakeswapChefV2) {
    return contract.CAKE();
  }

  async getTotalAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChefV2>) {
    const poolInfo = await contract.poolInfo(definition.poolIndex);
    return poolInfo.isRegular ? contract.totalRegularAllocPoint() : contract.totalSpecialAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChefV2>) {
    return contract.poolInfo(definition.poolIndex).then(i => i.allocPoint);
  }

  async getTotalRewardRate({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChefV2>) {
    const poolInfo = await contract.poolInfo(definition.poolIndex);
    return contract.cakePerBlock(poolInfo.isRegular);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
    multicall,
  }: GetMasterChefTokenBalancesParams<PancakeswapChefV2>) {
    const booster = this.contractFactory.pancakeswapFarmBooster({
      address: this.boosterAddress,
      network: this.network,
    });

    const proxyAddress = await multicall.wrap(booster).proxyContract(address);
    if (proxyAddress === ZERO_ADDRESS) return [0];

    return contract.userInfo(contractPosition.dataProps.poolIndex, proxyAddress).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
    multicall,
  }: GetMasterChefTokenBalancesParams<PancakeswapChefV2>) {
    const booster = this.contractFactory.pancakeswapFarmBooster({
      address: this.boosterAddress,
      network: this.network,
    });

    const proxyAddress = await multicall.wrap(booster).proxyContract(address);
    if (proxyAddress === ZERO_ADDRESS) return [0];

    return contract.pendingCake(contractPosition.dataProps.poolIndex, proxyAddress);
  }
}
