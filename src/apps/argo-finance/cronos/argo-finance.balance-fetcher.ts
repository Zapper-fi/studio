import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ARGO_FINANCE_DEFINITION } from '../argo-finance.definition';
import { ArgoFinanceContractFactory } from '../contracts';

const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(ARGO_FINANCE_DEFINITION.id, network)
export class CronosArgoFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ArgoFinanceContractFactory) private readonly argoFinanceContractFactory: ArgoFinanceContractFactory,
  ) {}

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: ARGO_FINANCE_DEFINITION.id,
      groupId: ARGO_FINANCE_DEFINITION.groups.pledging.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(
          token => token.symbol === 'xARGO' && token.metaType === MetaType.CLAIMABLE,
        )!;
        const rewardToken2 = contractPosition.tokens.find(token => token.symbol === 'WCRO')!;
        // Instantiate an Ethers contract instance
        const contract = this.argoFinanceContractFactory.xArgoPledging(contractPosition);

        // Resolve the requested address' staked balance and earned balance
        const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
          multicall.wrap(contract)._balances(address),
          multicall.wrap(contract).claimableRewards(address),
        ]);
        // Drill the balance into the token object. Drill will push the balance into the token tree,
        // thereby showing the user's exposure to underlying tokens of the jar token!
        return [
          drillBalance(stakedToken, stakedBalanceRaw.toString()),
          drillBalance(
            rewardToken,
            rewardBalanceRaw
              .find(token => token.token === '0xb966b5d6a0fcd5b373b180bbe072bbfbbee10552')!
              .amount.toString(),
          ),
          drillBalance(
            rewardToken2,
            rewardBalanceRaw
              .find(token => token.token === '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23')!
              .amount.toString(),
          )!,
        ];
      },
    });
  }

  async getBalances(address: string) {
    const [farmBalances] = await Promise.all([this.getFarmBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pledging',
        assets: farmBalances,
      },
    ]);
  }
}
