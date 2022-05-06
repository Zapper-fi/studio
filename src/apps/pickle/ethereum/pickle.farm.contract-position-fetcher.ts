import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleJarMasterchef } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.ContractPositionFetcher({
  appId: PICKLE_DEFINITION.id,
  groupId: PICKLE_DEFINITION.groups.masterchefFarm.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumPickleFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) private readonly contractFactory: PickleContractFactory,
  ) {}

  async getPositions(): Promise<ContractPosition<DefaultDataProps>[]> {
    const network = Network.ETHEREUM_MAINNET;

    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PickleJarMasterchef>({
      address: '0xbd17b1ce622d73bd438b9e658aca5996dc394b0d',
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.masterchefFarm.id,
      network,
      dependencies: [
        {
          appId: PICKLE_DEFINITION.id,
          groupIds: [PICKLE_DEFINITION.groups.jar.id],
          network,
        },
      ],
      resolveContract: ({ address, network }) =>
        this.contractFactory.pickleJarMasterchef({
          network,
          address,
        }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).pickle(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).picklePerBlock(),
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
      }),
    });
  }
}
