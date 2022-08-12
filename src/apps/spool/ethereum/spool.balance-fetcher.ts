import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SpoolContractFactory } from '~apps/spool';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { IMulticallWrapper } from '~multicall';
import { ContractPosition } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SPOOL_DEFINITION } from '../spool.definition';

const network = Network.ETHEREUM_MAINNET;

type VaultDataProps = {
  strategies: string[];
};

type VaultPosition = ContractPosition<VaultDataProps>;

type ResolveBalancesProps = { address: string; contractPosition: VaultPosition; multicall: IMulticallWrapper };

@Register.BalanceFetcher(SPOOL_DEFINITION.id, network)
export class EthereumSpoolBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Inject(SpoolContractFactory)
  private readonly spoolContractFactory: SpoolContractFactory;

  async getBalances(address: string) {
    const balances = await this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SPOOL_DEFINITION.id,
      groupId: SPOOL_DEFINITION.groups.vault.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async (props: ResolveBalancesProps) => {
        const { address, contractPosition, multicall } = props;

        const suppliedToken = contractPosition.tokens.find(isSupplied)!;
        const contract = this.spoolContractFactory.spoolVault(contractPosition);
        const strategies = contractPosition.dataProps.strategies;

        const [balanceRaw] = await Promise.all([
          multicall.wrap(contract).callStatic.getUpdatedUser(strategies, { from: address }),
        ]);

        // balanceRaw[5] + balanceRaw[7]: pending deposits
        // balanceRaw[4]: user's funds in underlying asset
        const pendingDeposit = balanceRaw[5].add(balanceRaw[7]);
        const balance = balanceRaw[4].add(pendingDeposit);
        return [drillBalance(suppliedToken, balance.toString())];
      },
    });

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: balances,
      },
    ]);
  }
}
