import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory, SynthetixRewards } from '../contracts';
import { SynthetixMintrBalanceHelper } from '../helpers/synthetix.mintr.balance-helper';
import { SynthetixSynthBalanceHelper } from '../helpers/synthetix.synth.balance-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.BalanceFetcher(SYNTHETIX_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumSynthetixBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixSynthBalanceHelper)
    private readonly synthetixSynthBalanceHelper: SynthetixSynthBalanceHelper,
    @Inject(SynthetixMintrBalanceHelper)
    private readonly synthetixMintrBalanceHelper: SynthetixMintrBalanceHelper,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
  ) {}

  private async getSynthTokenBalances(address: string) {
    return this.synthetixSynthBalanceHelper.getSynthBalances({
      address,
      network: Network.ETHEREUM_MAINNET,
      resolverAddress: '0x823be81bbf96bec0e25ca13170f5aacb5b79ba83',
    });
  }

  private async getMintrBalance(address: string) {
    return this.synthetixMintrBalanceHelper.getBalances({
      address,
      network: Network.ETHEREUM_MAINNET,
      resolverAddress: '0x823be81bbf96bec0e25ca13170f5aacb5b79ba83',
    });
  }

  private async getStakedBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<SynthetixRewards>({
      address,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.farm.id,
      network: Network.ETHEREUM_MAINNET,
      resolveContract: ({ address, network }) => this.synthetixContractFactory.synthetixRewards({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  async getBalances(address: string) {
    const [synthBalances, mintrBalance, stakedBalances] = await Promise.all([
      this.getSynthTokenBalances(address),
      this.getMintrBalance(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Synths',
        assets: [...synthBalances],
      },
      {
        label: 'Mintr',
        assets: mintrBalance.assets,
        meta: mintrBalance.meta,
      },
      {
        label: 'Staking',
        assets: [...stakedBalances],
      },
    ]);
  }
}
