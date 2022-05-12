import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinContractFactory } from '../contracts';

@Register.TokenPositionFetcher({
  appId: AELIN_DEFINITION.id,
  groupId: AELIN_DEFINITION.groups.vAelin.id,
  network: Network.OPTIMISM_MAINNET,
})
export class OptimismAelinVAelinTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AelinContractFactory) private readonly aelinContractFactory: AelinContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens({
      appId: AELIN_DEFINITION.id,
      groupId: AELIN_DEFINITION.groups.vAelin.id,
      network: Network.OPTIMISM_MAINNET,
      resolveContract: ({ address, network }) => this.aelinContractFactory.aelinVAelin({ address, network }),
      resolveVaultAddresses: () => ['0x780f70882ff4929d1a658a4e8ec8d4316b24748a'],
      resolveUnderlyingTokenAddress: () => '0x61baadcf22d2565b0f471b291c475db5555e0b76',
      resolveReserve: () => 0,
      resolvePricePerShare: () => 1,
      resolvePrimaryLabel: ({ symbol }) => symbol,
    });
  }
}
