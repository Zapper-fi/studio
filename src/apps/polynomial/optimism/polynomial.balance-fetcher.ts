import { Inject } from '@nestjs/common';
import { map, range, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { PolynomialContractFactory } from '../contracts';
import { POLYNOMIAL_DEFINITION } from '../polynomial.definition';

const appId = POLYNOMIAL_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(POLYNOMIAL_DEFINITION.id, network)
export class OptimismPolynomialBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly contractFactory: PolynomialContractFactory,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: POLYNOMIAL_DEFINITION.groups.vaults.id,
      network,
    });
  }

  async getPendingBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: POLYNOMIAL_DEFINITION.id,
      groupId: POLYNOMIAL_DEFINITION.groups.vaults.id,
      network,
      resolveBalances: async ({ address, multicall, contractPosition: position }) => {
        const contract = this.contractFactory.polynomialCoveredCall(position);

        const [withdrawalHead, depositHead] = await Promise.all([
          multicall.wrap(contract).queuedWithdrawalHead(),
          multicall.wrap(contract).queuedDepositHead(),
        ]);

        // Note: ignores pending deposits when deposit queue is large. Consider checking if the last user is ZERO_ADDRESS and recursing
        const pendingDeposits = await Promise.all(
          map(range(250), async i => multicall.wrap(contract).depositQueue(Number(depositHead) + Number(i))),
        );
        const pendingDepositBalance = sumBy(pendingDeposits, deposit => {
          // Note: ignores partial deposits
          if (deposit.user.toLowerCase() === address.toLowerCase() && !Number(deposit.mintedTokens)) {
            return Number(deposit.depositedAmount);
          }
          return 0;
        });

        // Note: ignores pending withdrawals when withdrawal queue is large
        const pendingWithdrawals = await Promise.all(
          map(range(250), async i => multicall.wrap(contract).withdrawalQueue(Number(withdrawalHead) + Number(i))),
        );
        const pendingWithdrawalTokens = sumBy(pendingWithdrawals, withdrawal => {
          // Note: ignores partial withdrawals
          if (withdrawal.user.toLowerCase() === address.toLowerCase() && !Number(withdrawal.returnedAmount)) {
            return Number(withdrawal.withdrawnTokens);
          }
          return 0;
        });
        // Note: note strictly correct, should return position tokens directly
        const tokenPrice = Number(await multicall.wrap(contract).getTokenPrice());
        const pendingWithdrawalBalance = pendingWithdrawalTokens * tokenPrice;

        return [
          drillBalance(
            position.tokens.find(isSupplied)!,
            (pendingDepositBalance + pendingWithdrawalBalance).toString(),
          ),
        ];
      },
    });
  }

  async getBalances(address: string) {
    const [poolTokenBalances, pendingVaultBalances] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getPendingBalances(address),
    ]);
    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Pending',
        assets: pendingVaultBalances,
      },
    ]);
  }
}
