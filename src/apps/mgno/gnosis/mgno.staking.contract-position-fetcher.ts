import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MgnoContractFactory } from '../contracts';
import { MGNO_DEFINITION } from '../mgno.definition';

const appId = MGNO_DEFINITION.id;
const groupId = MGNO_DEFINITION.groups.staking.id;
const network = Network.GNOSIS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class GnosisMgnoStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MgnoContractFactory) private readonly mgnoContractFactory: MgnoContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
