import { Inject, Injectable } from '@nestjs/common';
import { formatBytes32String } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { Network } from '~types';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixMintrMetaHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class SynthetixMintrMetaHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  async getMeta({ address, network }: SynthetixMintrMetaHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const [mintrPosition] = await this.appToolkit.getAppContractPositions({
      appId: SYNTHETIX_DEFINITION.id,
      groupIds: [SYNTHETIX_DEFINITION.groups.mintr.id],
      network,
    });

    if (!mintrPosition) return [];
    const snxToken = mintrPosition.tokens.find(isSupplied)!;
    const susdToken = mintrPosition.tokens.find(isBorrowed)!;
    const synthetixContract = this.contractFactory.synthetixNetworkToken(mintrPosition);

    const [unlockedSnxRaw, collateralRaw, debtBalanceRaw] = await Promise.all([
      multicall.wrap(synthetixContract).balanceOf(address),
      multicall.wrap(synthetixContract).collateral(address),
      multicall.wrap(synthetixContract).debtBalanceOf(address, formatBytes32String('sUSD')),
    ]);

    // Collateral and debt computations
    const collateralBalance = Number(collateralRaw) / 10 ** 18;
    const unlockedSnx = Number(unlockedSnxRaw) / 10 ** 18;
    const debtBalance = Number(debtBalanceRaw) / 10 ** 18;
    const collateralUSD = collateralBalance * snxToken.price;
    const debtBalanceUSD = -debtBalance * susdToken.price;
    const cRatio = debtBalance > 0 ? (collateralUSD / debtBalance) * 100 : 1;
    const escrowed = collateralBalance - unlockedSnx;
    const unescrowed = unlockedSnx;

    return [
      { label: 'Collateral', ...buildDollarDisplayItem(collateralUSD) },
      { label: 'Debt', ...buildDollarDisplayItem(debtBalanceUSD) },
      { label: 'C-Ratio', ...buildPercentageDisplayItem(cRatio) },
      { label: 'Escrowed SNX', ...buildNumberDisplayItem(escrowed) },
      { label: 'Unescrowed SNX', ...buildNumberDisplayItem(unescrowed) },
      { label: 'SNX Price', ...buildDollarDisplayItem(snxToken.price) },
    ];
  }
}
