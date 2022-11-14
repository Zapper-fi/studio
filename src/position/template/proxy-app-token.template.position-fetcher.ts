import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory, Erc20 } from '~contract/contracts';
import { AppTokenPosition } from '~position/position.interface';

import { AppTokenTemplatePositionFetcher } from './app-token.template.position-fetcher';
import { DefaultAppTokenDataProps } from './app-token.template.types';

export abstract class ProxyAppTokenTemplatePositionFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ContractFactory) protected readonly contractFactory: ContractFactory,
  ) {
    super(appToolkit);
  }

  abstract getProxyAddress(address: string): Promise<string>;
  abstract getProxiedPositions(): Promise<AppTokenPosition<DefaultAppTokenDataProps>[]>;

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  getAddresses() {
    return [];
  }

  getAccountAddress(address: string): Promise<string> {
    return this.getProxyAddress(address);
  }

  async getPositionsForBalances(): Promise<AppTokenPosition<DefaultAppTokenDataProps>[]> {
    const positions = await this.getProxiedPositions();
    return positions.map(appToken => {
      const appGroupNetwork = { appId: this.appId, groupId: this.groupId, network: this.network };
      const proxiedAppToken = { ...appToken, ...appGroupNetwork };
      proxiedAppToken.key = this.appToolkit.getPositionKey(proxiedAppToken);
      return proxiedAppToken;
    });
  }
}
