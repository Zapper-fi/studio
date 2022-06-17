import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXContractFactory, BeethovenXMasterchef } from '../contracts';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.farm.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomBeethovenXFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXContractFactory) private readonly contractFactory: BeethovenXContractFactory,
  ) {}

  async getPositions() {
    const contractPositions =
      await this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<BeethovenXMasterchef>({
        address: '0x8166994d9ebbe5829ec86bd81258149b87facfd3',
        appId,
        groupId,
        network,
        dependencies: [
          {
            appId,
            groupIds: [BEETHOVEN_X_DEFINITION.groups.pool.id],
            network,
          },
          {
            appId,
            groupIds: [BEETHOVEN_X_DEFINITION.groups.fBeets.id],
            network,
          },
        ],
        resolveContract: ({ address, network }) => this.contractFactory.beethovenXMasterchef({ address, network }),
        resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
        resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
          multicall.wrap(contract).lpTokens(poolIndex),
        resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).beets(),
        resolveLabel: ({ stakedToken }) => `${getLabelFromToken(stakedToken)}`,
        resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
          resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
            multicall
              .wrap(contract)
              .poolInfo(poolIndex)
              .then(v => v.allocPoint),
          resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
          resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).beetsPerBlock(),
        }),
        resolveReturnOnInvestmentLabel: () => 'APR',
      });

    return compact(contractPositions);
  }
}
