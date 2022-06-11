import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolContractFactory } from '../contracts';
import { BastionSwapTokenHelper } from '../helper/bastion-protocol.swap.token-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.swap.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSwapTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BastionSwapTokenHelper) private readonly bastionSupplyTokenHelper: BastionSwapTokenHelper,
  ) { }

  async getPositions() {
    return this.bastionSupplyTokenHelper.getTokens({
      pools: [
        {
          swapAddress: "0x6287e912a9Ccd4D5874aE15d3c89556b2a05f080",
          lpTokenAddress: "0x0039f0641156cac478b0DebAb086D78B66a69a01",
          label: "cUSDc/cUSDT Pool",
        }
      ],
      network,
      appId,
      groupId,
    });
  }
}
