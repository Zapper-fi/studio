import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
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

  async getVaultToken({ poolIndex, contract, multicall }) {
    const pool = await multicall.wrap(contract).pools(poolIndex);
    const vault = this.bluebitContractFactory.vault({ address: pool.vault, network: network });
    const token = await vault.swapPair();
    return token.toLowerCase();
  }

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<Bluebit>({
      address: '0x947dD92990343aE1D6Cbe2102ea84eF73Bc5790E',
      appId,
      groupId,
      network,
      minimumTvl: 10000,
      dependencies: [
        {
          appId,
          groupIds: [BLUEBIT_DEFINITION.groups.vault.id],
          network,
        },
      ],
      resolveContract: opts => this.bluebitContractFactory.bluebit(opts),
      resolvePoolLength: async ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: async ({ poolIndex, contract, multicall }) =>
        this.getVaultToken({ poolIndex, contract, multicall }),
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
