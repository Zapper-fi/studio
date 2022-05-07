import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import {
  OlympusBondV1ContractPositionBalanceHelper,
  OlympusContractFactory,
  OlympusV1BondDepository,
} from '~apps/olympus';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { KLIMA_DEFINITION } from '../klima.definition';

const appId = KLIMA_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(appId, network)
export class PolygonKlimaBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) private readonly olympusContractFactory: OlympusContractFactory,
    @Inject(OlympusBondV1ContractPositionBalanceHelper)
    private readonly olympusContractPositionBalanceHelper: OlympusBondV1ContractPositionBalanceHelper,
  ) {}

  private async getStakedBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId,
      groupId: KLIMA_DEFINITION.groups.sKlima.id,
      address,
    });
  }

  private async getWrappedStakedBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId,
      groupId: KLIMA_DEFINITION.groups.wsKlima.id,
      address,
    });
  }

  private async getBondBalances(address: string) {
    return this.olympusContractPositionBalanceHelper.getBalances<OlympusV1BondDepository>({
      network,
      groupId: KLIMA_DEFINITION.groups.bond.id,
      appId,
      address,
      resolveDepositoryContract: ({ depositoryAddress: address }) =>
        this.olympusContractFactory.olympusV1BondDepository({ network, address }),
      resolveClaimablePayout: ({ multicall, contract, address }) => multicall.wrap(contract).pendingPayoutFor(address),
      resolveTotalPayout: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .bondInfo(address)
          .then(v => v.payout),
    });
  }

  async getBalances(address: string) {
    const [stakedBalances, wrappedStakedBalances, bondBalances] = await Promise.all([
      this.getStakedBalances(address),
      this.getWrappedStakedBalances(address),
      this.getBondBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staked',
        assets: [...stakedBalances, ...wrappedStakedBalances],
      },
      {
        label: 'Bonds',
        assets: bondBalances,
      },
    ]);
  }
}
