import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SaddleContractFactory } from '../contracts';
import { SADDLE_DEFINITION } from '../saddle.definition';

const appId = SADDLE_DEFINITION.id;
const groupId = SADDLE_DEFINITION.groups.pool.id;
const network = Network.EVMOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EvmosSaddlePoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SaddleContractFactory) private readonly saddleContractFactory: SaddleContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
