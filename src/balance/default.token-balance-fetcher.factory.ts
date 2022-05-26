import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { ContractFactory } from '~contract';
import { MulticallService } from '~multicall/multicall.service';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { PositionService } from '~position/position.service';
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
    @Inject(PositionService) private readonly positionService: PositionService,
    @Inject(MulticallService) private readonly multicallService: MulticallService,
    @Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService,
  ) {
    this.contractFactory = new ContractFactory((network: Network) => this.networkProviderService.getProvider(network));
  }

  build({ appId, groupId, network }: BuildTokenBalanceFetcherParams) {
    const klass = class DefaultTokenBalanceFetcher implements PositionBalanceFetcher<AppTokenPositionBalance> {
      constructor(
        readonly positionService: PositionService,
        readonly multicallService: MulticallService,
        readonly contractFactory: ContractFactory,
      ) {}

      async getBalances(address: string) {
        const multicall = this.multicallService.getMulticall(network);
        const tokens = await this.positionService.getAppTokenPositions({ network, appId, groupIds: [groupId] });

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

    const instance = new klass(this.positionService, this.multicallService, this.contractFactory);
    return instance;
  }
}
