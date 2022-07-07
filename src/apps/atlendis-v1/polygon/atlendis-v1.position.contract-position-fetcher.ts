import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ATLENDIS_V_1_DEFINITION } from '../atlendis-v1.definition';
import { AtlendisV1ContractFactory } from '../contracts';

const appId = ATLENDIS_V_1_DEFINITION.id;
const groupId = ATLENDIS_V_1_DEFINITION.groups.position.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonAtlendisV1PositionContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AtlendisV1ContractFactory) private readonly atlendisV1ContractFactory: AtlendisV1ContractFactory,
  ) {}

  async getPositions() {
    const contract = this.atlendisV1ContractFactory.positionManager({
      address: '0x55E4e70a725C1439dac6B9412B71fC8372Bd73e9',
      network,
    });

    const endpoint = 'https://atlendis.herokuapp.com/graphql';

    return [];
  }
}
