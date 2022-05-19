import { Inject } from '@nestjs/common';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { COMPOUND_DEFINITION } from '~apps/compound/compound.definition';
import { CompoundContractFactory } from '~apps/compound/contracts';
import { CompoundLendingBalanceHelper } from '~apps/compound/helper/compound.lending.balance-helper';
import { CompoundLendingMetaHelper } from '~apps/compound/helper/compound.lending.meta-helper';
import { ProductItem } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BProtocolContractFactory } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

export class CompoundBProtocolAdapter {
  constructor(
    @Inject(CompoundLendingBalanceHelper) private readonly compoundLendingBalanceHelper: CompoundLendingBalanceHelper,
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

    const lendingBalances = await this.compoundLendingBalanceHelper.getBalances({
      address: avatarAddress,
      appId: COMPOUND_DEFINITION.id,
      supplyGroupId: COMPOUND_DEFINITION.groups.supply.id,
      borrowGroupId: COMPOUND_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      getBorrowBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).borrowBalanceCurrent(address),
    });

    const meta = this.compoundLendingMetaHelper.getMeta({ balances: lendingBalances });

    return {
      label: 'Compound',
      assets: lendingBalances,
      meta,
    };
  }
}
