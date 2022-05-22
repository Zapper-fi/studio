import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlutusEpochStaking } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.lock.id;
const network = Network.ARBITRUM_MAINNET;
const address = '0xbeb981021ed9c85aa51d96c0c2eda10ee4404a2e'.toLowerCase();

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusLockContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly plutusContractFactory: PlutusContractFactory,
  ) { }

  async getPositions() {
    const positions = this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PlutusEpochStaking>({
      network,
      appId,
      groupId,
      dependencies: [
        {
          appId,
          groupIds: [groupId],
          network,
        },
      ],
      resolveFarmAddresses: () => [address],
      resolveFarmContract: ({ address, network }) => this.plutusContractFactory.plutusEpochStaking({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).pls(),
      resolveRewardTokenAddresses: ({ contract, multicall }) => multicall.wrap(contract).stakingRewards(),
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
    return positions
  }
}
