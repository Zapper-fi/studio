import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DfxContractFactory } from '../contracts';
import { DFX_DEFINITION } from '../dfx.definition';

const appId = DFX_DEFINITION.id;
const groupId = DFX_DEFINITION.groups.staking.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonDfxStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DfxContractFactory) private readonly dfxContractFactory: DfxContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
