import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BluebitChef, BluebitContractFactory } from '../contracts';

@PositionTemplate()
export class AuroraBluebitFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<BluebitChef> {
  groupLabel = 'Farms';
  chefAddress = '0x947dd92990343ae1d6cbe2102ea84ef73bc5790e';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BluebitContractFactory) protected readonly contractFactory: BluebitContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BluebitChef {
    return this.contractFactory.bluebitChef({ address, network: this.network });
  }

  async getPoolLength(contract: BluebitChef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: BluebitChef, poolIndex: number) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const pool = await contract.pools(poolIndex);
    const vaultContract = this.contractFactory.vault({ address: pool.vault.toLowerCase(), network: this.network });
    return multicall.wrap(vaultContract).swapPair();
  }

  async getRewardTokenAddress(contract: BluebitChef) {
    return contract.bluebitToken();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<BluebitChef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<BluebitChef>): Promise<BigNumberish> {
    return contract.rewardPerBlock();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<BluebitChef>): Promise<BigNumberish> {
    return contract.pools(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BluebitChef>): Promise<BigNumberish> {
    return contract.pendingRewards(contractPosition.dataProps.poolIndex, address);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BluebitChef>): Promise<BigNumberish> {
    const [user, pool] = await Promise.all([
      contract.users(contractPosition.dataProps.poolIndex, address),
      contract.pools(contractPosition.dataProps.poolIndex),
    ]);

    if (Number(user.shares) === 0 || Number(pool.shares) === 0) return 0;

    const vault = this.contractFactory.vault({ address: pool.vault, network: this.network });
    return user.shares.mul(await vault.totalSupply()).div(pool.shares);
  }
}
