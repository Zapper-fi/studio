import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionSupplyTokenHelper } from '../helper/bastion-protocol.supply.token-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.supply.id;
const network = Network.AURORA_MAINNET;

export type BastionSupplyTokenDataProps = ExchangeableAppTokenDataProps & {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  marketName?: string;
  comptrollerAddress: string;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BastionSupplyTokenHelper) private readonly bastionSupplyTokenHelper: BastionSupplyTokenHelper,
  ) { }
  async getPositions() {
    return this.bastionSupplyTokenHelper.getTokens({
      comptrollerAddress: '0x6De54724e128274520606f038591A00C5E94a1F6',
      network,
      appId,
      groupId,
    });
  }
}
