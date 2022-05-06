import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { OlympusContractFactory } from '../contracts';
import { OlympusBondV2ContractPositionBalanceHelper } from '../helpers/olympus.bond-v2.contract-position-balance-helper';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

@Register.BalanceFetcher(OLYMPUS_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumOlympusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(OlympusContractFactory) private readonly contractFactory: OlympusContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusBondV2ContractPositionBalanceHelper)
    private readonly contractPositionBalanceHelper: OlympusBondV2ContractPositionBalanceHelper,
  ) {}

  private async getTokenBalances(address: string) {
    const network = Network.ETHEREUM_MAINNET;
    const appId = OLYMPUS_DEFINITION.id;
    const groupIds = [
      OLYMPUS_DEFINITION.groups.gOhm.id,
      OLYMPUS_DEFINITION.groups.sOhm.id,
      OLYMPUS_DEFINITION.groups.sOhmV1.id,
      OLYMPUS_DEFINITION.groups.wsOhmV1.id,
    ];

    const balances = await Promise.all(
      groupIds.map(groupId =>
        this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
          network,
          appId,
          groupId,
          address,
        }),
      ),
    );

    return balances.flat();
  }

  private async getBonds(address: string) {
    const network = Network.ETHEREUM_MAINNET;
    return this.contractPositionBalanceHelper.getBalances({
      network,
      groupId: OLYMPUS_DEFINITION.groups.bond.id,
      appId: OLYMPUS_DEFINITION.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [stakedAssets, bonds] = await Promise.all([this.getTokenBalances(address), this.getBonds(address)]);
    return presentBalanceFetcherResponse([
      {
        label: 'Staked',
        assets: stakedAssets,
      },
      {
        label: 'Bonds',
        assets: bonds,
      },
    ]);
  }
}
