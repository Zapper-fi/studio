import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import {
  CompoundBorrowBalanceHelper,
  CompoundContractFactory,
  CompoundLendingMetaHelper,
  CompoundSupplyBalanceHelper,
} from '~apps/compound';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AURIGAMI_CONTRACT_ADDRESSES, AURIGAMI_DEFINITION } from '../aurigami.definition';
import { AurigamiClaimableBalanceHelper } from '../helper/aurigami.claimable.balance-helper';

const appId = AURIGAMI_DEFINITION.id;
const network = Network.AURORA_MAINNET;

@Register.BalanceFetcher(AURIGAMI_DEFINITION.id, network)
export class AuroraAurigamiBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(CompoundBorrowBalanceHelper)
    private readonly compoundBorrowBalanceHelper: CompoundBorrowBalanceHelper,
    @Inject(CompoundSupplyBalanceHelper)
    private readonly compoundSupplyBalanceHelper: CompoundSupplyBalanceHelper,
    @Inject(AurigamiClaimableBalanceHelper)
    private readonly aurigamiClaimableBalanceHelper: AurigamiClaimableBalanceHelper,
    @Inject(CompoundLendingMetaHelper)
    private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
    @Inject(CompoundContractFactory)
    private readonly compoundContractFactory: CompoundContractFactory,
  ) {}

  async getSupplyBalances(address: string) {
    return this.compoundSupplyBalanceHelper.getBalances({
      address,
      appId,
      groupId: AURIGAMI_DEFINITION.groups.supply.id,
      network,
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBorrowBalances(address: string) {
    return this.compoundBorrowBalanceHelper.getBalances({
      address,
      appId,
      groupId: AURIGAMI_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getBorrowBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).borrowBalanceCurrent(address),
    });
  }

  async getClaimableBalances(address: string) {
    return this.aurigamiClaimableBalanceHelper.getBalances({
      address,
      appId,
      groupId: AURIGAMI_DEFINITION.groups.claimable.id,
      network,
      lensAddress: AURIGAMI_CONTRACT_ADDRESSES[network].lens,
      comptrollerAddress: AURIGAMI_CONTRACT_ADDRESSES[network].comptroller,
      fairlaunchAddress: AURIGAMI_CONTRACT_ADDRESSES[network].fairLaunch,
      stakingPoolIds: [0], // Currently aurigami has only 1 staking pool
      rewardAddress: AURIGAMI_CONTRACT_ADDRESSES[network].ply,
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
