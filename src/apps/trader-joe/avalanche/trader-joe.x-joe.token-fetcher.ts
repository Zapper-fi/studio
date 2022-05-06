import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TraderJoeContractFactory } from '../contracts';
import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

@Register.TokenPositionFetcher({
  appId: TRADER_JOE_DEFINITION.id,
  groupId: TRADER_JOE_DEFINITION.groups.xJoe.id,
  network: Network.AVALANCHE_MAINNET,
})
export class AvalancheTraderJoeXJoeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory)
    private readonly traderJoeContractFactory: TraderJoeContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleVaultTokenHelper.getTokens({
      appId: TRADER_JOE_DEFINITION.id,
      groupId: TRADER_JOE_DEFINITION.groups.xJoe.id,
      network: Network.AVALANCHE_MAINNET,
      address: '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33',
      resolveUnderlyingTokenAddress: () => '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd',
      resolveContract: ({ address, network }) => this.traderJoeContractFactory.erc20({ address, network }),
    });
  }
}
