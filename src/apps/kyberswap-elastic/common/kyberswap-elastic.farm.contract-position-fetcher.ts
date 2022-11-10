import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { KyberswapElasticContractFactory, Masterchef } from '../contracts';

export abstract class KyberSwapElasticFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<Masterchef> {
  private multicall: IMulticallWrapper;
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapElasticContractFactory) protected readonly contractFactory: KyberswapElasticContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Masterchef {
    return this.contractFactory.masterchef({ address, network: this.network });
  }

  async getPoolLength(contract: Masterchef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: Masterchef, poolIndex: number) {
    return contract.getPoolInfo(poolIndex).then(v => v.poolAddress);
  }

  async getRewardTokenAddress(contract: Masterchef) {
    return contract.rewardLocker().then(v => v);
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<Masterchef>) {
    return 1;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<Masterchef>) {
    return 1;
  }

  async getTotalRewardRate({ contract, definition }: GetMasterChefDataPropsParams<Masterchef>) {
    return 1;
    return contract.getPoolInfo(definition.poolIndex).then(v => v.totalSecondsClaimed[0]);
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<Masterchef>) {
    return 0;
    const nfts = await this.multicall.wrap(contract).getDepositedNFTs(address);
    const amounts = await Promise.all(nfts.map(nft => this.getStakedTokenBalancePerNFT(nft, contract)));
    const total = BigNumber.from(0);
    for (const amount of amounts) {
      total.add(amount);
    }
    return total;
  }

  async getRewardTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<Masterchef>) {
    return 1000;
    // contractPosition.dataProps.poolIndex
    const nfts = await this.multicall.wrap(contract).getDepositedNFTs(address);
    const amounts = await Promise.all(nfts.map(nft => this.getRewardPendingPerNFT(nft, contract)));

    const total = BigNumber.from(0);
    for (const amount of amounts) {
      total.add(amount);
    }
    return total;
  }

  async getStakedTokenBalancePerNFT(nftID: BigNumber, masterChef: Masterchef): Promise<BigNumber> {
    const multicall = this.getMultiCall();
    const poolIDs = await multicall.wrap(masterChef).getJoinedPools(nftID);
    const userInfos = await Promise.all(
      poolIDs.map(async poolID => multicall.wrap(masterChef).getUserInfo(nftID, poolID)),
    );
    const amount = BigNumber.from(0);
    for (const userInfo of userInfos) {
      amount.add(userInfo.liquidity);
    }
    return amount;
  }

  async getRewardPendingPerNFT(nftID: BigNumber, masterChef: Masterchef): Promise<BigNumber> {
    const multicall = this.getMultiCall();
    const poolIDs = await multicall.wrap(masterChef).getJoinedPools(nftID);
    const userInfos = await Promise.all(
      poolIDs.map(async poolID => multicall.wrap(masterChef).getUserInfo(nftID, poolID)),
    );
    const amount = BigNumber.from(0);
    for (const userInfo of userInfos) {
      amount.add(userInfo.rewardPending[0]);
    }
    return amount;
  }

  getMultiCall(): IMulticallWrapper {
    if (this.multicall == null || this.multicall == undefined) {
      this.multicall = this.appToolkit.getMulticall(this.network);
    }
    return this.multicall;
  }
}
