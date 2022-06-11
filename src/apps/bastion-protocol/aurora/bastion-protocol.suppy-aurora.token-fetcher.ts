import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BastionProtocolContractFactory } from '../contracts';
import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionSupplyTokenHelper } from '../helper/bastion-protocol.supply.token-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.suppyAurora.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSuppyAuroraTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BastionSupplyTokenHelper) private readonly bastionSupplyTokenHelper: BastionSupplyTokenHelper,
  ) { }

  async getPositions() {
    return this.bastionSupplyTokenHelper.getTokens({
      comptrollerAddress: '0xe1cf09BDa2e089c63330F0Ffe3F6D6b790835973',
      network,
      appId,
      groupId,
    });
  }
}
