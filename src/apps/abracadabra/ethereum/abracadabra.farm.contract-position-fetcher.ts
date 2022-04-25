import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { CURVE_DEFINITION } from '~apps/curve';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory, PopsicleChef } from '../contracts';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAbracadabraFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) private readonly contractFactory: AbracadabraContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PopsicleChef>({
      address: '0xf43480afe9863da4acbd4419a47d9cc7d25a647f',
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: 'sushiswap',
          groupIds: ['pool'],
          network,
        },
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveContract: ({ address, network }) => this.contractFactory.popsicleChef({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.stakingToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).ice(),
      rewardRateUnit: RewardRateUnit.SECOND,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).icePerSecond(),
      }),
    });
  }
}
