import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VelodromeContractFactory } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

const appId = VELODROME_DEFINITION.id;
const groupId = VELODROME_DEFINITION.groups.votingEscrow.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismVelodromeVotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) private readonly velodromeContractFactory: VelodromeContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
