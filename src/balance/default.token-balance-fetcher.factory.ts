import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { ContractFactory } from '~contract';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types';

type BuildTokenBalanceFetcherParams = {
  appId: string;
  groupId: string;
  network: Network;
};

@Injectable()
export class DefaultTokenBalanceFetcherFactory {
  private readonly contractFactory: ContractFactory;

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService,
  ) {
    this.contractFactory = new ContractFactory((network: Network) => this.networkProviderService.getProvider(network));
  }

  build({ appId, groupId, network }: BuildTokenBalanceFetcherParams) {
    const klass = class DefaultTokenBalanceFetcher {
      constructor(readonly appToolkit: IAppToolkit, readonly contractFactory: ContractFactory) {}

      async getBalances(address: string) {
        const multicall = this.appToolkit.getMulticall(network);
        const tokens = await this.appToolkit.getAppTokenPositions({ network, appId, groupIds: [groupId] });

        const tokenBalances = Promise.all(
          tokens.map(async token => {
            const contract = multicall.wrap(this.contractFactory.erc20(token));
            const balanceRaw = await contract.balanceOf(address);
            const tokenBalance = drillBalance(token, balanceRaw.toString());
            return tokenBalance;
          }),
        );

        return tokenBalances;
      }
    };

    const instance = new klass(this.appToolkit, this.contractFactory);
    return instance;
  }
}
