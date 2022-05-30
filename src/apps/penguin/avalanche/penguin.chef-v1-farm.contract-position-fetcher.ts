import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types';

import { PenguinContractFactory, PenguinChef } from '../contracts';
import { PENGUIN_DEFINITION } from '../penguin.definition';

@Register.ContractPositionFetcher({
  appId: PENGUIN_DEFINITION.id,
  groupId: PENGUIN_DEFINITION.groups.chefV1Farm.id,
  network: Network.AVALANCHE_MAINNET,
})
export class AvalanchePenguinChefV1FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PenguinContractFactory) private readonly contractFactory: PenguinContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PenguinChef>({
      address: '0x8ac8ed5839ba269be2619ffeb3507bab6275c257',
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.chefV1Farm.id,
      network: Network.AVALANCHE_MAINNET,
      dependencies: [{ appId: 'pangolin', groupIds: ['pool'], network: Network.AVALANCHE_MAINNET }],
      resolveContract: ({ address, network }) => this.contractFactory.penguinChef({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).pefi(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).pefiPerBlock(),
      }),
    });
  }
}
