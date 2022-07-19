import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { OriginStoryContractFactory } from '../contracts';
import { ORIGIN_STORY_DEFINITION } from '../origin-story.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ORIGIN_STORY_DEFINITION.id, network)
export class EthereumOriginStoryBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OriginStoryContractFactory) private readonly contractFactory: OriginStoryContractFactory,
  ) {}

  async getStakeBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: ORIGIN_STORY_DEFINITION.id,
      groupId: ORIGIN_STORY_DEFINITION.groups.series.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const ogn = contractPosition.tokens?.[0];
        const contract = this.contractFactory.series({ ...contractPosition });
        const stake = await multicall.wrap(contract).balanceOf(address);

        return [drillBalance(ogn, stake.toString())];
      },
    });
  }

  async getBalances(address: string) {
    return presentBalanceFetcherResponse([
      {
        label: 'OGN Stake',
        assets: await this.getStakeBalances(address),
      },
    ]);
  }
}
