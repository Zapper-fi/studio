import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory } from '../contracts';
import { QiDaoVaultPositionBalanceHelper } from '../helpers/qi-dao.vault.position-balance-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const network = Network.GNOSIS_MAINNET;

@Register.BalanceFetcher(QI_DAO_DEFINITION.id, Network.GNOSIS_MAINNET)
export class GnosisQiDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoVaultPositionBalanceHelper)
    private readonly qiDaoVaultTokenBalanceHelper: QiDaoVaultPositionBalanceHelper,
    @Inject(QiDaoContractFactory) private readonly contractFactory: QiDaoContractFactory,
  ) { }

  async getVaultTokenBalances(address: string) {
    return this.qiDaoVaultTokenBalanceHelper.getPositionBalances({
      address,
      network,
    });
  }

  async getBalances(address: string) {
    const [vaultTokenBalances] = await Promise.all([
      this.getVaultTokenBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultTokenBalances,
      }
    ]);
  }
}
