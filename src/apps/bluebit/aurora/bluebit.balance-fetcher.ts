import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TokenBalanceHelper } from '~app-toolkit/helpers/balance/token-balance.helper';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BLUEBIT_DEFINITION } from '../bluebit.definition';
import { Bluebit, BluebitContractFactory } from '../contracts';

const appId = BLUEBIT_DEFINITION.id;
const network = Network.AURORA_MAINNET;
const zero = BigNumber.from(0);

@Register.BalanceFetcher(BLUEBIT_DEFINITION.id, network)
export class AuroraBluebitBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(BluebitContractFactory) private readonly bluebitContractFactory: BluebitContractFactory,
  ) {}

  async getVaultBalances(address: string) {
    return await this.tokenBalanceHelper.getTokenBalances({
      network,
      appId,
      groupId: BLUEBIT_DEFINITION.groups.vault.id,
      address,
    });
  }

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<Bluebit>({
      address,
      appId,
      groupId: BLUEBIT_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: () =>
        this.bluebitContractFactory.bluebit({
          network,
          address: '0x947dD92990343aE1D6Cbe2102ea84eF73Bc5790E',
        }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: async ({ contract, multicall, contractPosition }) => {
          const [user, pool] = await Promise.all([
            multicall.wrap(contract).users(contractPosition.dataProps.poolIndex, address),
            multicall.wrap(contract).pools(contractPosition.dataProps.poolIndex),
          ]);
          if (user.shares.eq(zero) || pool.shares.eq(zero)) return zero;
          const vault = this.bluebitContractFactory.vault({ address: pool.vault, network: network });
          return user.shares.mul(await vault.totalSupply()).div(pool.shares);
        },
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingRewards(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [vaultBalances, farmBalances] = await Promise.all([
      this.getVaultBalances(address),
      this.getFarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
    ]);
  }
}
