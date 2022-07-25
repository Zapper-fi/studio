import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateChef, StargateContractFactory } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheStargateFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) private readonly contractFactory: StargateContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<StargateChef>({
      address: '0x8731d54e9d02c286767d56ac03e8037c07e01e98',
      appId,
      groupId,
      network,
      dependencies: [{ appId: STARGATE_DEFINITION.id, groupIds: [STARGATE_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.stargateChef({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).stargate(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).stargatePerBlock(),
      }),
    });
  }
}
