import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionSupplyTokenHelper } from '../helper/bastion-protocol.supply.token-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.supplyStakedNear.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSupplyStakedNearTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BastionSupplyTokenHelper) private readonly bastionSupplyTokenHelper: BastionSupplyTokenHelper) {}
  async getPositions() {
    const tokens = await this.bastionSupplyTokenHelper.getTokens({
      comptrollerAddress: '0xe550a886716241afb7ee276e647207d7667e1e79',
      realmName: 'Staked Near',
      network,
      appId,
      groupId,
    });

    return compact(tokens);
  }
}
