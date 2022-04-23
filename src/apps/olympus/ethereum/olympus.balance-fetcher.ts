import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import { OlympusBondDepository, OlympusContractFactory, OlympusV2BondDepository } from '../contracts';
import { OlympusBondContractPositionBalanceHelper } from '../helpers/olympus.bond.contract-position-balance-helper';
import { OlympusBondV2ContractPositionBalanceHelper } from '../helpers/olympus.bondV2.contract-position-balance-helper';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

@Register.BalanceFetcher(OLYMPUS_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumOlympusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(OlympusContractFactory) private readonly contractFactory: OlympusContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusBondContractPositionBalanceHelper)
    private readonly contractPositionBalanceHelper: OlympusBondContractPositionBalanceHelper,
    private readonly contractPositionV2BalanceHelper: OlympusBondV2ContractPositionBalanceHelper,
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
    return this.contractPositionBalanceHelper.getBalances<OlympusBondDepository>({
      network,
      groupId: OLYMPUS_DEFINITION.groups.bond.id,
      appId: OLYMPUS_DEFINITION.id,
      address,
      resolveDepositoryContract: ({ depositoryAddress: address }) =>
        this.contractFactory.olympusBondDepository({ network, address }),
      resolveClaimablePayout: ({ multicall, contract, address }) => multicall.wrap(contract).pendingPayoutFor(address),
      resolveTotalPayout: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .bondInfo(address)
          .then(v => v.payout),
    });
  }

  private async getV2Bonds(address: string) {
    const network = Network.ETHEREUM_MAINNET;
    return this.contractPositionV2BalanceHelper.getBalances<OlympusV2BondDepository>({
      network,
      groupId: OLYMPUS_DEFINITION.groups.bondV2.id,
      appId: OLYMPUS_DEFINITION.id,
      address,
      resolveDepositoryContract: ({ depositoryAddress: address }) => {
        return this.contractFactory.olympusV2BondDepository({ address, network });
      },
      resolveClaimablePayout: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .indexesFor(address)
          .then(
            async indexes =>
              await Promise.all(indexes.map(index => multicall.wrap(contract).pendingFor(address, index))),
          ),
    });
  }

  async getBalances(address: string) {
    const [stakedAssets, bonds, bondsV2] = await Promise.all([
      this.getTokenBalances(address),
      this.getBonds(address),
      this.getV2Bonds(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staked',
        assets: stakedAssets,
      },
      {
        label: 'Bond V1',
        assets: bonds,
      },
      { label: 'Bond', assets: bondsV2 },
    ]);
  }
}
