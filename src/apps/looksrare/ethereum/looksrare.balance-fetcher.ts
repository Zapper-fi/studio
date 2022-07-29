import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { Aggregator, Feesharing, LooksrareContractFactory } from '../contracts';

import { LOOKSRARE_DEFINITION } from '../looksrare.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(LOOKSRARE_DEFINITION.id, network)
export class EthereumLooksrareBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LooksrareContractFactory) private readonly looksRareContractFactory: LooksrareContractFactory,
  ) {}

  async getBalances(address: string) {
    const [autoCompound, standard] = await Promise.all([
      this.getAutoCompoundPosition(address),
      this.getStandardPosition(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'LOOKS Compounder',
        assets: autoCompound,
      },
      {
        label: 'Standard Staking',
        assets: standard,
      },
    ]);
  }

  async getStandardPosition(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<Feesharing>({
      address,
      appId: LOOKSRARE_DEFINITION.id,
      groupId: LOOKSRARE_DEFINITION.groups.standard.id,
      network,
      resolveContract: ({ address, network }) => this.looksRareContractFactory.feesharing({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).calculateSharesValueInLOOKS(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).calculatePendingRewards(address),
    });
  }

  async getAutoCompoundPosition(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<Aggregator>({
      address,
      appId: LOOKSRARE_DEFINITION.id,
      groupId: LOOKSRARE_DEFINITION.groups.autocompounding.id,
      network,
      resolveContract: ({ address, network }) => this.looksRareContractFactory.aggregator({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).calculateSharesValueInLOOKS(address),
      resolveRewardTokenBalances: () => [],
    });
  }
}
