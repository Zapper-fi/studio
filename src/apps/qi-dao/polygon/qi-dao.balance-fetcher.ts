import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory, QiDaoMasterChef } from '../contracts';
import { QiDaoVaultPositionBalanceHelper } from '../helpers/qi-dao.vault.position-balance-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(QI_DAO_DEFINITION.id, network)
export class PolygonQiDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoVaultPositionBalanceHelper)
    private readonly qiDaoVaultPositionBalanceHelper: QiDaoVaultPositionBalanceHelper,
    @Inject(QiDaoContractFactory) private readonly contractFactory: QiDaoContractFactory,
  ) {}

  async getYieldTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: QI_DAO_DEFINITION.id,
      groupId: QI_DAO_DEFINITION.groups.yield.id,
      network,
    });
  }

  async getEscrowedQiBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: QI_DAO_DEFINITION.id,
      groupId: QI_DAO_DEFINITION.groups.escrowedQi.id,
      network,
      resolveBalances: async ({ address, network, multicall, contractPosition }) => {
        const contract = this.contractFactory.qiDaoEscrowedQi({ network, address: contractPosition.address });
        const userInfo = await multicall.wrap(contract).userInfo(address);
        return [drillBalance(contractPosition.tokens[0], userInfo.amount.toString())];
      },
    });
  }

  async getVaultTokenBalances(address: string) {
    return this.qiDaoVaultPositionBalanceHelper.getPositionBalances({ address, network });
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
    const [yieldTokenBalances, vaultTokenBalances, escrowedQiBalances, stakedBalances] = await Promise.all([
      this.getYieldTokenBalances(address),
      this.getVaultTokenBalances(address),
      this.getEscrowedQiBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Yield',
        assets: yieldTokenBalances,
      },
      {
        label: 'Vaults',
        assets: vaultTokenBalances,
      },
      {
        label: 'Escrowed QI',
        assets: escrowedQiBalances,
      },
      {
        label: 'Staking',
        assets: stakedBalances,
      },
    ]);
  }
}
