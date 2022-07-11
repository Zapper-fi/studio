import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { VaporwaveFinanceContractFactory } from '../contracts';
import { VAPORWAVE_FINANCE_DEFINITION } from '../vaporwave-finance.definition';

const network = Network.AURORA_MAINNET;

@Register.BalanceFetcher(VAPORWAVE_FINANCE_DEFINITION.id, network)
export class AuroraVaporwaveFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VaporwaveFinanceContractFactory)
    private readonly vaporwaveFinanceContractFactory: VaporwaveFinanceContractFactory,
  ) {}

  async getVaultTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: VAPORWAVE_FINANCE_DEFINITION.id,
      groupId: VAPORWAVE_FINANCE_DEFINITION.groups.vault.id,
      network: Network.AURORA_MAINNET,
    });
  }

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: VAPORWAVE_FINANCE_DEFINITION.id,
      groupId: VAPORWAVE_FINANCE_DEFINITION.groups.farm.id,
      network: Network.AURORA_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;

        // Instantiate an Ethers contract instance
        const contract = this.vaporwaveFinanceContractFactory.launchpool(contractPosition);

        // Resolve the requested address' staked balance and earned balance
        const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
          multicall.wrap(contract).balanceOf(address),
          multicall.wrap(contract).earned(address),
        ]);

        // Drill the balance into the token object. Drill will push the balance into the token tree,
        // thereby showing the user's exposure to underlying tokens
        return [
          drillBalance(stakedToken, stakedBalanceRaw.toString()),
          drillBalance(rewardToken, rewardBalanceRaw.toString()),
        ];
      },
    });
  }

  // http://localhost:5001/apps/vaporwave-finance/balances?addresses[]=0x6d62ed9470eb0fcfe2c17493ac32b555be44e2cd&network=aurora
  async getBalances(address: string) {
    const [vaultTokenBalances, farmBalances] = await Promise.all([
      this.getVaultTokenBalances(address),
      this.getFarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultTokenBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
    ]);
  }
}
