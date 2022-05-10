import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ThalesContractFactory } from '../contracts';
import { THALES_DEFINITION } from '../thales.definition';

const appId = THALES_DEFINITION.id;
const groupId = THALES_DEFINITION.groups.pool2.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismThalesPool2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly thalesContractFactory: ThalesContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
