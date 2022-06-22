import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EvmoswapMasterchef, EvmoswapContractFactory } from '../contracts';
import { EVMOSWAP_DEFINITION } from '../evmoswap.definition';

const appId = EVMOSWAP_DEFINITION.id;
const groupId = EVMOSWAP_DEFINITION.groups.farm.id;
const network = Network.EVMOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EvmosEvmoswapFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EvmoswapContractFactory) private readonly evmoswapContractFactory: EvmoswapContractFactory,
  ) {}

  async getPositions() {
    const positions =
      await this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<EvmoswapMasterchef>({
        network,
        groupId,
        appId,
        address: '0x8C1196601dd52998fa84b28b2F8DBADd3B3C9Df0',
        dependencies: [{ appId, groupIds: [EVMOSWAP_DEFINITION.groups.pool.id], network }],
        resolveContract: opts => this.evmoswapContractFactory.evmoswapMasterchef(opts),
        resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
        resolveDepositTokenAddress: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(pool => pool.lpToken),
        resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).emo(),
        rewardRateUnit: RewardRateUnit.SECOND,
        resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
          resolvePoolAllocPoints: ({ multicall, contract, poolIndex }) =>
            multicall
              .wrap(contract)
              .poolInfo(poolIndex)
              .then(i => i.allocPoint),
          resolveTotalAllocPoints: async ({ multicall, contract /*, poolIndex */ }) => {
            return multicall.wrap(contract).totalAllocPoint();
          },
          resolveTotalRewardRate: async ({ multicall, contract /*, poolIndex */ }) => {
            return multicall.wrap(contract).emoPerSecond();
          },
        }),
      });

    return positions;
  }
}
