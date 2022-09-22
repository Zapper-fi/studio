import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumPerpTokensFarmHelper } from '../helpers/mycelium.perp-tokens-farm.contract-position-helper';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.perpFarms.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumMyceliumPerpFarmsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MyceliumPerpTokensFarmHelper) private readonly myceliumPerpTokensFarmHelper: MyceliumPerpTokensFarmHelper,
  ) {}

  async getPositions() {
    return this.myceliumPerpTokensFarmHelper.getPositions();
  }
}
