import { Inject } from '@nestjs/common';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { COMPOUND_DEFINITION } from '~apps/compound/compound.definition';
import { CompoundContractFactory } from '~apps/compound/contracts';
import { CompoundBorrowBalanceHelper } from '~apps/compound/helper/compound.borrow.balance-helper';
import { CompoundLendingMetaHelper } from '~apps/compound/helper/compound.lending.meta-helper';
import { CompoundSupplyBalanceHelper } from '~apps/compound/helper/compound.supply.balance-helper';
import { ProductItem } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BProtocolContractFactory } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

export class CompoundBProtocolAdapter {
  constructor(
    @Inject(CompoundBorrowBalanceHelper) private readonly compoundBorrowBalanceHelper: CompoundBorrowBalanceHelper,
    @Inject(CompoundSupplyBalanceHelper) private readonly compoundSupplyBalanceHelper: CompoundSupplyBalanceHelper,
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(CompoundLendingMetaHelper) private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
    @Inject(BProtocolContractFactory) private readonly bProtocolContractFactory: BProtocolContractFactory,
  ) {}

  async getBalances(address: string): Promise<ProductItem | null> {
    const registry = this.bProtocolContractFactory.bProtocolCompoundRegistry({
      address: '0xbf698df5591caf546a7e087f5806e216afed666a',
      network,
    });

    const avatarAddress = await registry.avatarOf(address);
    if (avatarAddress === ZERO_ADDRESS) return null;

    const [borrowBalances, supplyBalances] = await Promise.all([
      this.compoundBorrowBalanceHelper.getBalances({
        address: avatarAddress,
        appId: COMPOUND_DEFINITION.id,
        groupId: COMPOUND_DEFINITION.groups.borrow.id,
        network,
        getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
        getBorrowBalanceRaw: ({ contract, address, multicall }) =>
          multicall.wrap(contract).borrowBalanceCurrent(address),
      }),
      this.compoundSupplyBalanceHelper.getBalances({
        address: avatarAddress,
        appId: COMPOUND_DEFINITION.id,
        groupId: COMPOUND_DEFINITION.groups.supply.id,
        network,
        getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
        getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      }),
    ]);

    const meta = this.compoundLendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });

    return {
      label: 'Compound',
      assets: [...supplyBalances, ...borrowBalances],
      meta,
    };
  }
}
