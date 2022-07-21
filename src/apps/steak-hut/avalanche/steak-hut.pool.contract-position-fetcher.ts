import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TRADER_JOE_DEFINITION } from '~apps/trader-joe/trader-joe.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SteakHutContractFactory, SteakHutPool } from '../contracts';
import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

const appId = STEAK_HUT_DEFINITION.id;
const groupId = STEAK_HUT_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheSteakHutPoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) private readonly contractFactory: SteakHutContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<SteakHutPool>({
      address: '0xddbfbd5dc3ba0feb96cb513b689966b2176d4c09'.toLowerCase(),
      appId,
      groupId,
      network,
      dependencies: [{ appId: TRADER_JOE_DEFINITION.id, groupIds: [TRADER_JOE_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.steakHutPool({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).JOE(),
    });
  }
}
