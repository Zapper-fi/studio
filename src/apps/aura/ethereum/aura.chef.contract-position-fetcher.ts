import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { AuraContractFactory, AuraMasterchef } from '../contracts';

@PositionTemplate()
export class EthereumAuraChefContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<AuraMasterchef> {
  chefAddress = '0x1ab80f7fb46b25b7e0b2cfac23fc88ac37aaf4e9';
  groupLabel = 'Farms';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly contractFactory: AuraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraMasterchef {
    return this.contractFactory.auraMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: AuraMasterchef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: AuraMasterchef, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: AuraMasterchef): Promise<string> {
    return contract.cvx();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<AuraMasterchef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<AuraMasterchef>): Promise<BigNumberish> {
    const [rewardPerBlock, totalAllocPoint, { allocPoint }] = await Promise.all([
      contract.rewardPerBlock(),
      contract.totalAllocPoint(),
      contract.poolInfo(definition.poolIndex),
    ]);

    return rewardPerBlock.mul(allocPoint.mul(1000).div(totalAllocPoint)).div(1000);
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<AuraMasterchef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AuraMasterchef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<AuraMasterchef>): Promise<BigNumberish> {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const block = await provider.getBlockNumber();

    const { poolIndex } = contractPosition.dataProps;
    const [poolInfo, userInfo, totalAllocPoint, rewardPerBlock, endBlock] = await Promise.all([
      contract.poolInfo(poolIndex),
      contract.userInfo(poolIndex, address),
      contract.totalAllocPoint(),
      contract.rewardPerBlock(),
      contract.endBlock(),
    ]);

    if (userInfo.amount.eq(0)) {
      return 0;
    }

    const lpToken = this.appToolkit.globalContracts.erc20({ address: poolInfo.lpToken, network: this.network });
    const lpSupply = await lpToken.balanceOf(contract.address);

    let { accCvxPerShare } = poolInfo;
    if (poolInfo.lastRewardBlock.lt(block) && lpSupply.gt(0)) {
      const clampedTo = Math.min(block, Number(endBlock));
      const clampedFrom = Math.min(Number(poolInfo.lastRewardBlock), Number(endBlock));
      const multiplier = BigNumber.from(clampedTo - clampedFrom);
      const reward = multiplier.mul(rewardPerBlock).mul(poolInfo.allocPoint).div(totalAllocPoint);
      accCvxPerShare = accCvxPerShare.add(reward.mul(10 ** 12).div(lpSupply));
    }

    return userInfo.amount
      .mul(accCvxPerShare)
      .div(10 ** 12)
      .sub(userInfo.rewardDebt);
  }
}
