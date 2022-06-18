import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2/uniswap-v2.definition';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GroContractFactory, GroLpTokenStaker } from '../contracts';
import { GRO_DEFINITION } from '../gro.definition';

const appId = GRO_DEFINITION.id;
const groupId = GRO_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumGroFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GroContractFactory) private readonly groContractFactory: GroContractFactory,
  ) {}

  async getPositions(): Promise<ContractPosition<DefaultDataProps>[]> {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<GroLpTokenStaker>({
      address: '0x2e32bad45a1c29c1ea27cf4dd588df9e68ed376c'.toLowerCase(),
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
        {
          appId: UNISWAP_V2_DEFINITION.id,
          groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveContract: ({ address, network }) =>
        this.groContractFactory.groLpTokenStaker({
          network,
          address,
        }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .poolInfo(0)
          .then(v => v.lpToken),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).groPerBlock(),
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
