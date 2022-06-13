import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';
import { CompoundLendingMetaHelper, CompoundSupplyBalanceHelper } from '~apps/compound';

import { TectonicContractFactory } from '../contracts';
import { TectonicClaimableBalanceHelper } from '../helper/tectonic.claimable.balance-helper';
import { TectonicSupplyBalanceHelper } from '../helper/tectonic.supply.balance-helper';
import { TectonicBorrowBalanceHelper } from '../helper/tectonic.borrow.balance-helper';
import { TECTONIC_DEFINITION } from '../tectonic.definition';

const appId = TECTONIC_DEFINITION.id;
const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(appId, network)
export class CronosTectonicBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(TectonicBorrowBalanceHelper)
    private readonly tectonicBorrowBalanceHelper: TectonicBorrowBalanceHelper,
    @Inject(TectonicSupplyBalanceHelper)
    private readonly tectonicSupplyBalanceHelper: TectonicSupplyBalanceHelper,
    @Inject(TectonicClaimableBalanceHelper)
    private readonly tectonicClaimableBalanceHelper: TectonicClaimableBalanceHelper,
    @Inject(CompoundLendingMetaHelper)
    private readonly lendingMetaHelper: CompoundLendingMetaHelper,
    @Inject(TectonicContractFactory)
    private readonly tectonicContractFactory: TectonicContractFactory,
  ) {}

  async getSupplyBalances(address: string) {
    return this.tectonicSupplyBalanceHelper.getBalances({
      address,
      appId,
      groupId: TECTONIC_DEFINITION.groups.supply.id,
      network,
      getTokenContract: ({ address, network }) => this.tectonicContractFactory.tectonicTToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBorrowBalances(address: string) {
    return this.tectonicBorrowBalanceHelper.getBalances({
      address,
      appId,
      groupId: TECTONIC_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.tectonicContractFactory.tectonicTToken({ address, network }),
      getBorrowBalanceRaw: ({ contract, address }) => contract.callStatic.borrowBalanceCurrent(address),
    });
  }

  async getClaimableBalances(address: string) {
    return this.tectonicClaimableBalanceHelper.getBalances({
      address,
      appId,
      groupId: TECTONIC_DEFINITION.groups.claimable.id,
      network,
      lensAddress: '0x37bafe282cb7d4ef6ad80ee979c341c91def4c17',
      rewardTokenAddress: '0xdd73dea10abc2bff99c60882ec5b2b81bb1dc5b2',
      tectonicCoreAddress: '0xb3831584acb95ed9ccb0c11f677b5ad01deaeec0',
    });
  }

  async getBalances(address: string) {
    const [supplyBalances, borrowBalances, claimableBalances] = await Promise.all([
      this.getSupplyBalances(address),
      this.getBorrowBalances(address),
      this.getClaimableBalances(address),
    ]);

    const meta = this.lendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });
    const claimableProduct = { label: 'Claimable', assets: claimableBalances };
    const lendingProduct = { label: 'Lending', assets: [...supplyBalances, ...borrowBalances], meta };

    return presentBalanceFetcherResponse([lendingProduct, claimableProduct]);
  }
}
