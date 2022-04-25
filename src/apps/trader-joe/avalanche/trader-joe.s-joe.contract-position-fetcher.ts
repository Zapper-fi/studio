import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TraderJoeContractFactory, TraderJoeStableStaking } from '../contracts';
import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

const appId = TRADER_JOE_DEFINITION.id;
const groupId = TRADER_JOE_DEFINITION.groups.sJoe.id;
const network = Network.AVALANCHE_MAINNET;
@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheTraderJoeSJoeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory)
    private readonly contractFactory: TraderJoeContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<TraderJoeStableStaking>(
      {
        appId,
        groupId,
        network,
        resolveFarmAddresses: async () => ['0x1a731b2299e22fbac282e7094eda41046343cb51'],
        resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).joe(),
        resolveFarmContract: opts => this.contractFactory.traderJoeStableStaking(opts),
        resolveRewardTokenAddresses: async ({ multicall, contract }) => {
          const length = await multicall.wrap(contract).rewardTokensLength().then(Number);
          return Promise.all(_.range(length).map(i => multicall.wrap(contract).rewardTokens(i)));
        },
        resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
      },
    );
  }
}
