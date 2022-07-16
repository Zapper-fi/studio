import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionSupplyTokenHelper } from '../helper/bastion-protocol.supply.token-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.supply.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BastionSupplyTokenHelper) private readonly bastionSupplyTokenHelper: BastionSupplyTokenHelper) {}
  async getPositions() {
    const [main, aurora, stakednear, multichain] = await Promise.all([
      this.bastionSupplyTokenHelper.getTokens({
        comptrollerAddress: '0x6De54724e128274520606f038591A00C5E94a1F6',
        realmName: 'Main Hub',
        network,
        appId,
        groupId,
      }),
      this.bastionSupplyTokenHelper.getTokens({
        comptrollerAddress: '0xe1cf09BDa2e089c63330F0Ffe3F6D6b790835973',
        realmName: 'Aurora Realm',
        network,
        appId,
        groupId,
      }),
      this.bastionSupplyTokenHelper.getTokens({
        comptrollerAddress: '0xE550A886716241AFB7ee276e647207D7667e1E79',
        realmName: 'Staked Near Realm',
        network,
        appId,
        groupId,
      }),
      this.bastionSupplyTokenHelper.getTokens({
        comptrollerAddress: '0xA195b3d7AA34E47Fb2D2e5A682DF2d9EFA2daF06',
        realmName: 'Multichain Realm',
        network,
        appId,
        groupId,
      }),
    ]);

    const tokens = compact([main, aurora, stakednear, multichain]).flat();
    return tokens;
  }
}
