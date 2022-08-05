import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { OlympusBondV1ContractPositionBalanceHelper } from '~apps/olympus';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { HectorDaoContractFactory, HectorDaoBondDepository, HectorDaoStakeBondDepository } from '../contracts';
import { HECTOR_DAO_DEFINITION } from '../hector-dao.definition';

const appId = HECTOR_DAO_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(appId, network)
export class FantomHectorDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(HectorDaoContractFactory) private readonly contractFactory: HectorDaoContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusBondV1ContractPositionBalanceHelper)
    private readonly contractPositionBalanceHelper: OlympusBondV1ContractPositionBalanceHelper,
  ) {}

  private async getVaultBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      groupId: HECTOR_DAO_DEFINITION.groups.vault.id,
      appId,
      address,
    });
  }

  private async getBondBalances(address: string) {
    return this.contractPositionBalanceHelper.getBalances<HectorDaoBondDepository>({
      network,
      appId,
      address,
      groupId: HECTOR_DAO_DEFINITION.groups.bond.id,
      resolveDepositoryContract: ({ depositoryAddress: address }) =>
        this.contractFactory.hectorDaoBondDepository({ network, address }),
      resolveClaimablePayout: ({ multicall, contract, address }) => multicall.wrap(contract).pendingPayoutFor(address),
      resolveTotalPayout: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .bondInfo(address)
          .then(v => v.payout),
    });
  }

  private async getStakeBondBalances(address: string) {
    return this.contractPositionBalanceHelper.getBalances<HectorDaoStakeBondDepository>({
      network,
      appId,
      address,
      groupId: HECTOR_DAO_DEFINITION.groups.stakeBond.id,
      resolveDepositoryContract: ({ depositoryAddress: address }) =>
        this.contractFactory.hectorDaoStakeBondDepository({ network, address }),
      resolveClaimablePayout: ({ multicall, contract, address }) => multicall.wrap(contract).pendingPayoutFor(address),
      resolveTotalPayout: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .bondInfo(address)
          .then(v => v.payout),
    });
  }

  async getBalances(address: string) {
    const [vaultBalances, bondBalances, stakeBondBalances] = await Promise.all([
      this.getVaultBalances(address),
      this.getBondBalances(address),
      this.getStakeBondBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vault',
        assets: vaultBalances,
      },
      {
        label: 'Bonds',
        assets: [...bondBalances, ...stakeBondBalances],
      },
    ]);
  }
}
