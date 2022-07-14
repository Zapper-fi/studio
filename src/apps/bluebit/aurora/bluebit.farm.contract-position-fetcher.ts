import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { TRISOLARIS_DEFINITION } from '~apps/trisolaris';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BLUEBIT_DEFINITION } from '../bluebit.definition';
import { Bluebit, BluebitContractFactory } from '../contracts';

const appId = BLUEBIT_DEFINITION.id;
const groupId = BLUEBIT_DEFINITION.groups.farm.id;
const network = Network.AURORA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraBluebitFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BluebitContractFactory) private readonly bluebitContractFactory: BluebitContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<Bluebit>({
      address: '0x947dd92990343ae1d6cbe2102ea84ef73bc5790e',
      appId,
      groupId,
      network,
      dependencies: [{ appId: TRISOLARIS_DEFINITION.id, groupIds: [TRISOLARIS_DEFINITION.groups.pool.id], network }],
      resolveContract: opts => this.bluebitContractFactory.bluebit(opts),
      resolvePoolLength: async ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: async ({ poolIndex, contract, multicall }) => {
        const pool = await multicall.wrap(contract).pools(poolIndex);
        const vault = this.bluebitContractFactory.vault({ address: pool.vault, network: network });
        return await multicall.wrap(vault).swapPair();
      },
      resolveLiquidity: async ({ multicall, contract, poolIndex }) => {
        const pool = await multicall.wrap(contract).pools(poolIndex);
        const vault = this.bluebitContractFactory.vault({ address: pool.vault, network: network });
        return await multicall.wrap(vault).totalSupply();
      },
      resolveRewardTokenAddresses: async ({ multicall, contract }) => multicall.wrap(contract).bluebitToken(),
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .pools(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).rewardPerBlock(),
      }),
    });
  }
}
