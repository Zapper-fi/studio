import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { COMPOUND_DEFINITION } from '~apps/compound';
import { AppTokenPosition } from '~position/position.interface';
import { DefaultAppTokenDataProps } from '~position/template/app-token.template.types';
import { ProxyAppTokenTemplatePositionFetcher } from '~position/template/proxy-app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import B_PROTOCOL_DEFINITION from '../b-protocol.definition';
import { BProtocolContractFactory } from '../contracts';

export class BProtocolCompoundSupplyTokenFetcher extends ProxyAppTokenTemplatePositionFetcher {
  appId = B_PROTOCOL_DEFINITION.id;
  groupId = B_PROTOCOL_DEFINITION.groups.compoundSupply.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Compound Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BProtocolContractFactory) protected readonly contractFactory: BProtocolContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  async getProxyAddress(address: string) {
    const registry = this.contractFactory.bProtocolCompoundRegistry({
      address: '0xbf698df5591caf546a7e087f5806e216afed666a',
      network: this.network,
    });

    const avatarAddress = await registry.avatarOf(address);
    return avatarAddress;
  }

  getProxiedPositions(): Promise<AppTokenPosition<DefaultAppTokenDataProps>[]> {
    return this.appToolkit.getAppTokenPositions({
      appId: COMPOUND_DEFINITION.id,
      groupIds: [COMPOUND_DEFINITION.groups.supply.id],
      network: this.network,
    });
  }
}
