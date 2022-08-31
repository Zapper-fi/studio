import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TraderJoeVeJoeStaking, TraderJoeContractFactory } from '../contracts';
import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

const appId = TRADER_JOE_DEFINITION.id;
const groupId = TRADER_JOE_DEFINITION.groups.veJoe.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheTraderJoeVeJoeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) private readonly contractFactory: TraderJoeContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<TraderJoeVeJoeStaking>({
      address: '0x25d85e17dd9e544f6e9f8d44f99602dbf5a97341',
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.traderJoeVeJoeStaking({ address, network }),
      resolvePoolLength: () => 1,
      resolveDepositTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).joe(),
      resolveRewardTokenAddresses: ({ contract, multicall }) => multicall.wrap(contract).veJoe(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async () => 1,
        resolveTotalAllocPoints: () => 1,
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).veJoePerSharePerSec(),
      }),
    });
  }
}
