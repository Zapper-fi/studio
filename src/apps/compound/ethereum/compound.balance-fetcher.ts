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
      lensAddress: '0xd513d22422a3062bd342ae374b4b9c20e0a9a074',
      rewardTokenAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      comptrollerAddress: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
    });
  }

  async getBalances(address: string) {
    const [supplyBalances, borrowBalances, claimableBalances] = await Promise.all([
      this.getSupplyBalances(address),
      this.getBorrowBalances(address),
      this.getClaimableBalances(address),
    ]);

    const supplyProduct = { label: 'Supply', assets: supplyBalances };
    const borrowProduct = { label: 'Borrow', assets: borrowBalances };
    const claimableProduct = { label: 'Claimable', assets: claimableBalances };
    const meta = this.compoundLendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });

    return presentBalanceFetcherResponse([supplyProduct, borrowProduct, claimableProduct], meta);
  }
}
