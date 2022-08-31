import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { COMPOUND_DEFINITION } from '../compound.definition';
import { CompoundContractFactory } from '../contracts';
import { CompoundBorrowBalanceHelper } from '../helper/compound.borrow.balance-helper';
import { CompoundClaimableBalanceHelper } from '../helper/compound.claimable.balance-helper';
import { CompoundLendingMetaHelper } from '../helper/compound.lending.meta-helper';
import { CompoundSupplyBalanceHelper } from '../helper/compound.supply.balance-helper';

const appId = COMPOUND_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumCompoundBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(CompoundBorrowBalanceHelper)
    private readonly compoundBorrowBalanceHelper: CompoundBorrowBalanceHelper,
    @Inject(CompoundSupplyBalanceHelper)
    private readonly compoundSupplyBalanceHelper: CompoundSupplyBalanceHelper,
    @Inject(CompoundClaimableBalanceHelper)
    private readonly compoundClaimableBalanceHelper: CompoundClaimableBalanceHelper,
    @Inject(CompoundLendingMetaHelper)
    private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
    @Inject(CompoundContractFactory)
    private readonly compoundContractFactory: CompoundContractFactory,
  ) {}

  async getSupplyBalances(address: string) {
    return this.compoundSupplyBalanceHelper.getBalances({
      address,
      appId,
      groupId: COMPOUND_DEFINITION.groups.supply.id,
      network,
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBorrowBalances(address: string) {
    return this.compoundBorrowBalanceHelper.getBalances({
      address,
      appId,
      groupId: COMPOUND_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getBorrowBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).borrowBalanceCurrent(address),
    });
  }

  async getClaimableBalances(address: string) {
    return this.compoundClaimableBalanceHelper.getBalances({
      address,
      appId,
      groupId: COMPOUND_DEFINITION.groups.claimable.id,
      network,
    });
  }

  async getBalances(address: string) {
    const [supplyBalances, borrowBalances, claimableBalances] = await Promise.all([
      this.getSupplyBalances(address),
      this.getBorrowBalances(address),
      this.getClaimableBalances(address),
    ]);

    const meta = this.compoundLendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });
    const claimableProduct = { label: 'Claimable', assets: claimableBalances };
    const lendingProduct = { label: 'Lending', assets: [...supplyBalances, ...borrowBalances], meta };

    return presentBalanceFetcherResponse([lendingProduct, claimableProduct]);
  }
}
