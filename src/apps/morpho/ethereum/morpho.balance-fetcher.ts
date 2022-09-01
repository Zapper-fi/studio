import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { MorphoContractFactory } from '~apps/morpho';
import { MorphoBalanceHelper } from '~apps/morpho/helpers/morpho.balance-helper';
import { MorphoCompoundLendingMetaHelper } from '~apps/morpho/helpers/morpho.compound-lending.meta-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MORPHO_DEFINITION } from '../morpho.definition';

const network = Network.ETHEREUM_MAINNET;
const appId = MORPHO_DEFINITION.id;
const groupIds = [MORPHO_DEFINITION.groups.morphoCompound.id];

@Register.BalanceFetcher(MORPHO_DEFINITION.id, network)
export class EthereumMorphoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) private readonly morphoContractFactory: MorphoContractFactory,
    @Inject(MorphoCompoundLendingMetaHelper) private readonly lendingMetaHelper: MorphoCompoundLendingMetaHelper,
    @Inject(MorphoBalanceHelper) private readonly balanceHelper: MorphoBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const lens = multicall.wrap(
      this.morphoContractFactory.morphoCompoundLens({ network, address: '0x930f1b46e1d081ec1524efd95752be3ece51ef67' }),
    );
    const { borrowPositionsBalances, supplyPositionsBalances, enteredMarkets } = await this.balanceHelper.getBalances({
      appId,
      lens,
      address,
      network,
      groupIds,
    });
    return presentBalanceFetcherResponse([
      {
        label: 'Morpho Compound',
        assets: [...supplyPositionsBalances, ...borrowPositionsBalances],
        meta: await this.lendingMetaHelper.getMeta(address, lens, enteredMarkets),
      },
    ]);
  }
}
