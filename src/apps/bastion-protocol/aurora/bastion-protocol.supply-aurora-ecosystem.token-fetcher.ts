import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionSupplyTokenHelper } from '../helper/bastion-protocol.supply.token-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.supplyAuroraEcosystem.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSupplyAuroraEcosystemTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BastionSupplyTokenHelper) private readonly bastionSupplyTokenHelper: BastionSupplyTokenHelper) {}
  async getPositions() {
    const tokens = await this.bastionSupplyTokenHelper.getTokens({
      comptrollerAddress: '0xe1cf09BDa2e089c63330F0Ffe3F6D6b790835973',
      realmName: 'Aurora Ecosystem',
      network,
      appId,
      groupId,
    });

    return compact(tokens);
  }
}
