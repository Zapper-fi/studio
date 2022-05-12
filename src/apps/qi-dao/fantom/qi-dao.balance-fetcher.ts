import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory, QiDaoMasterChef } from '../contracts';
import { QiDaoVaultPositionBalanceHelper } from '../helpers/qi-dao.vault.position-balance-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(QI_DAO_DEFINITION.id, Network.FANTOM_OPERA_MAINNET)
export class FantomQiDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoVaultPositionBalanceHelper)
    private readonly qiDaoVaultTokenBalanceHelper: QiDaoVaultPositionBalanceHelper,
    @Inject(QiDaoContractFactory) private readonly contractFactory: QiDaoContractFactory,
  ) {}

  async getVaultTokenBalances(address: string) {
    return this.qiDaoVaultTokenBalanceHelper.getPositionBalances({
      address,
      network,
    });
  }

  async getStakedBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<QiDaoMasterChef>({
      address,
      appId: QI_DAO_DEFINITION.id,
      groupId: QI_DAO_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.qiDaoMasterChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall
            .wrap(contract)
            .pending(contractPosition.dataProps.poolIndex, address)
            .catch(() => '0'),
      }),
    });
  }

  async getBalances(address: string) {
    const [vaultTokenBalances, stakedBalances] = await Promise.all([
      this.getVaultTokenBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultTokenBalances,
      },
      {
        label: 'Staking',
        assets: stakedBalances,
      },
    ]);
  }
}
