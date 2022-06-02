import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CronosVvsFinancePoolAddressCacheManager } from './vvs-finance.pool.cache-manager';

import { VvsCraftsmanV2, VvsFinanceContractFactory } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.farmV2.id;
const network = Network.CRONOS_MAINNET;

const craftsmanV1ContractAddress = '0xDccd6455AE04b03d785F12196B492b18129564bc';
const address = '0xbc149c62EFe8AFC61728fC58b1b66a0661712e76'; // craftsmanV2

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosVvsFinanceFarmV2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
    @Inject(CronosVvsFinancePoolAddressCacheManager) private readonly poolCacheManager: CronosVvsFinancePoolAddressCacheManager,
  ) {}

  async getPositions() {
    const pools = await this.poolCacheManager.getCraftsmanV2Pools();
    if (!pools || pools.length <= 0) return [];

    const multicall = this.appToolkit.getMulticall(network);
    const craftsmanV2Contract = multicall.wrap(
      this.contractFactory.vvsCraftsmanV2({ address, network })
    );

    const poolRecords: Record<string, typeof pools[number] & {
      rewarderAddresses: string[],
      rewards: {
        token: string,
        totalAllocPoint: BigNumber,
        rewardPerSecond: BigNumber,
        allocPoint: BigNumber,
        lastRewardTime: BigNumber,
        accRewardPerShare: BigNumber,
      }[],
    }> = Object.fromEntries(
      await Promise.all(
        pools.map(async pool => {
          const rewarderAddresses = await craftsmanV2Contract.poolRewarders(pool.poolId);

          const rewards = await Promise.all(rewarderAddresses.map(async rewardAddress => {
            const rewarderContract = multicall.wrap(
              this.contractFactory.vvsRewarder({ network, address: rewardAddress })
            );

            const rewarderPoolLength = await rewarderContract.poolLength();
            if (!rewarderPoolLength.gte(1)) return null;

            const { allocPoint, lastRewardTime, accRewardPerShare } = (
              await rewarderContract.poolInfo(pool.poolId)
            );
            return {
              token: await rewarderContract.rewardToken(),
              totalAllocPoint: await rewarderContract.totalAllocPoint(),
              rewardPerSecond: await rewarderContract.rewardPerSecond(),
              allocPoint, lastRewardTime, accRewardPerShare,
            }

          }));

          return [
            BigNumber.from(pool.poolId).toString(),
            {
              ...pool,
              rewarderAddresses,
              rewards: compact(rewards),
            },
          ]
        })
      )
    );

    const positions = await this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<VvsCraftsmanV2>({
      network,
      groupId,
      appId,
      address,
      dependencies: [{ appId, groupIds: [VVS_FINANCE_DEFINITION.groups.pool.id], network }],
      resolveContract: opts => this.contractFactory.vvsCraftsmanV2(opts),
      resolvePoolLength: () => (
        Math.max(...Object.keys(poolRecords).map(i => parseInt(i))) + 1
      ),
      resolvePoolIndexIsValid: async ({ poolIndex }) => !!poolRecords[poolIndex],
      resolveDepositTokenAddress: async ({ poolIndex }) => (
        poolRecords[poolIndex].lpToken
      ),
      resolveRewardTokenAddresses: async ({ poolIndex }) => (
        poolRecords[poolIndex].rewards.map(r => r.token)
      ),
      rewardRateUnit: RewardRateUnit.SECOND,
      resolveTotalValueLocked: async ({ depositTokenAddress, multicall }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20({ network, address: depositTokenAddress }))
          .balanceOf(craftsmanV1ContractAddress),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ poolIndex }) => (
          poolRecords[poolIndex].rewards.map(r => r.allocPoint).reduce((p, c) => p.add(c), BigNumber.from(0))
        ),
        resolveTotalAllocPoints: ({ poolIndex }) => (
          poolRecords[poolIndex].rewards.map(r => r.totalAllocPoint).reduce((p, c) => p.add(c), BigNumber.from(0))
        ),
        resolveTotalRewardRate: async ({ poolIndex }) => (
          poolRecords[poolIndex].rewards.map(r => r.rewardPerSecond).reduce((p, c) => p.add(c), BigNumber.from(0))
        ),
      }),
    });

    return positions;
  }
}
