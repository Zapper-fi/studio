import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CompoundContractFactory } from '~apps/compound';
import { CompoundLendingMetaHelper } from '~apps/compound/helper/compound.lending.meta-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { RariFuseLendingBalanceHelper } from '../helpers/rari-fuse.lending.balance-helper';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Register.BalanceFetcher(RARI_FUSE_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumRariFuseBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(CompoundContractFactory)
    private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(RariFuseLendingBalanceHelper)
    private readonly rariFuseLendingBalanceHelper: RariFuseLendingBalanceHelper,
    @Inject(CompoundLendingMetaHelper)
    private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
  ) {}

  async getLendingBalances(address: string) {
    return this.rariFuseLendingBalanceHelper.getBalances({
      address,
      appId: RARI_FUSE_DEFINITION.id,
      supplyGroupId: RARI_FUSE_DEFINITION.groups.supply.id,
      borrowGroupId: RARI_FUSE_DEFINITION.groups.borrow.id,
      network: Network.ETHEREUM_MAINNET,
      fuseLensAddress: '0x8da38681826f4abbe089643d2b3fe4c6e4730493',
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      getBorrowBalanceRaw: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .borrowBalanceCurrent(address)
          .catch(() => '0'),
    });
  }

  async getBalances(address: string) {
    const [lendingBalances] = await Promise.all([this.getLendingBalances(address)]);

    const meta = this.compoundLendingMetaHelper.getMeta({ balances: lendingBalances });

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: lendingBalances,
        meta: meta,
      },
    ]);
  }
}
