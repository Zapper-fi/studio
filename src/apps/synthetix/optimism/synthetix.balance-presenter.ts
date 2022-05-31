import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
import { BalancePresenter } from '~balance/balance-presenter.interface';
import { PositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { SynthetixMintrMetaHelper } from '../helpers/synthetix.mintr.meta-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.BalancePresenter({ appId: SYNTHETIX_DEFINITION.id, network: Network.OPTIMISM_MAINNET })
export class OptimismSynthetixBalancePresenter implements BalancePresenter {
  constructor(@Inject(SynthetixMintrMetaHelper) private readonly synthetixMintrMetaHelper: SynthetixMintrMetaHelper) {}

  async present(address: string, balances: PositionBalance<CompoundSupplyTokenDataProps>[]) {
    // Build labelled groups by the labels defined in the app definition
    const products = await Promise.all(
      Object.values(SYNTHETIX_DEFINITION.groups).map(async group => {
        const groupBalances = balances.filter(v => v.groupId === group.id);

        // For the Mintr group, add additional metadata
        if (group.id === SYNTHETIX_DEFINITION.groups.mintr.id) {
          const meta = await this.synthetixMintrMetaHelper.getMeta(address);
          return { label: group.label, assets: groupBalances, meta };
        }

        return { label: group.label, assets: groupBalances };
      }),
    );

    return presentBalanceFetcherResponse(products);
  }
}
