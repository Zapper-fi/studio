import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlsPlutusChef } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

import { VAULTS } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.plsFarm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusPlsFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PlsPlutusChef>({
      address: VAULTS.PLS_VAULT,
      appId,
      groupId,
      network,
      dependencies: [{ appId: 'sushiswap', groupIds: ['pool'], network }],
      resolveContract: opts => this.contractFactory.plsPlutusChef(opts),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: async ({ poolIndex, multicall, contract }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(info => info.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).PLS(),
      rewardRateUnit: RewardRateUnit.SECOND,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).plsPerSecond(),
      }),
    });
  }
}
