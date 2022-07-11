import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { MetaType } from '~position/position.interface';
import { getXVaultBalances } from '~apps/vvs-finance';

import { FerroContractFactory, FerroFarm, FerroBoost } from '../contracts';
import { FERRO_DEFINITION } from '../ferro.definition';

const appId = FERRO_DEFINITION.id;
const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(FERRO_DEFINITION.id, network)
export class CronosFerroBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(FerroContractFactory) private readonly contractFactory: FerroContractFactory,
  ) {}

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: FERRO_DEFINITION.groups.pool.id,
      network,
    });
  }

  private async getStakedLiquidity(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<FerroFarm>({
      address,
      appId,
      groupId: FERRO_DEFINITION.groups.stakedLiquidity.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.ferroFarm({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: async ({ address, contract, contractPosition, multicall }) => {
        const pendingTokens = await multicall
          .wrap(contract)
          .pendingFer(contractPosition.dataProps.poolIndex, address);

        const claimableToken = contractPosition.tokens.find(t => t.metaType === MetaType.CLAIMABLE)!;
        return [drillBalance(claimableToken, pendingTokens.toString())];
      },
    });
  }

  private async getXferBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      network,
      groupId: FERRO_DEFINITION.groups.xfer.id,
    });
  }

  private async getXferVaultBalances(address: string) {
    return getXVaultBalances<FerroBoost>({
      accountAddress: address,
      appToolkit: this.appToolkit,
      network,
      appId,
      groupIds: [FERRO_DEFINITION.groups.xferVault.id],
      resolveContract: ({ contractAddress, network }) => (
        this.contractFactory.ferroBoost({ network, address: contractAddress })
      ),
      resolveUserInfo: async ({ contract, multicall, accountAddress }) => (
        (await multicall.wrap(contract).getUserInfo(accountAddress))[2]
      ),
      resolveClaimableTokenBalance: ({ contract, multicall, accountAddress }) => (
        multicall.wrap(contract).pendingFer(accountAddress)
      )
    });
  }

  async getBalances(address: string) {
    const [
      poolTokenBalances,
      stakedLiquidity,
      xferBalances,
      xferVaultBalances,
    ] = await Promise.all([
      this.getPoolTokenBalances(address),
      this.getStakedLiquidity(address),
      this.getXferBalances(address),
      this.getXferVaultBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'Staked Liquidity',
        assets: stakedLiquidity,
      },
      {
        label: 'xFER',
        assets: xferBalances,
      },
      {
        label: 'xFER Vaults',
        assets: xferVaultBalances,
      },
    ]);
  }
}
