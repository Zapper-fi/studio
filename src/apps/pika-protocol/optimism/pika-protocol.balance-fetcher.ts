import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { PikaProtocolContractFactory } from '../contracts';
import { PIKA_PROTOCOL_DEFINITION } from '../pika-protocol.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(PIKA_PROTOCOL_DEFINITION.id, network)
export class OptimismPikaProtocolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolContractFactory) private readonly pikaProtocolContractFactory: PikaProtocolContractFactory
  ) { }

  async getBalances(address: string) {
    return presentBalanceFetcherResponse([]);
  }

  async getFarmBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address, appId: PIKA_PROTOCOL_DEFINITION.id, groupId: PIKA_PROTOCOL_DEFINITION.groups.vault.id,
      network: Network.OPTIMISM_MAINNET,

      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;

        const contract = this.pikaProtocolContractFactory.pikaProtocolVault({ address, network })

        const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all(
          [
            this.pikaProtocolContractFactory.vaultBalance(contract.address, stakedToken.address, network, multicall),
            // TODO: Resolve farm position balances
          ])
        return [] as any
      }
    })
  }
}
