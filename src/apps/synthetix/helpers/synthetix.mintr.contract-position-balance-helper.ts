import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { formatBytes32String } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixMintrContractPositionBalanceHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class SynthetixMintrContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly synthetixContractFactory: SynthetixContractFactory,
  ) {}

  async getBalances({ address, network }: SynthetixMintrContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.mintr.id,
      network,
      resolveBalances: async ({ contractPosition, multicall }) => {
        const collateralToken = contractPosition.tokens.find(isSupplied)!;
        const debtToken = contractPosition.tokens.find(isBorrowed)!;

        const contract = this.synthetixContractFactory.synthetixNetworkToken(contractPosition);
        const [collateralRaw, transferableRaw, debtBalanceRaw] = await Promise.all([
          multicall.wrap(contract).collateral(address),
          multicall.wrap(contract).transferableSynthetix(address),
          multicall.wrap(contract).debtBalanceOf(address, formatBytes32String('sUSD')),
        ]);

        const collateralBalanceRaw = new BigNumber(collateralRaw.toString())
          .minus(transferableRaw.toString())
          .toFixed(0);
        const collateralTokenBalance = drillBalance(collateralToken, collateralBalanceRaw);
        const debtTokenBalance = drillBalance(debtToken, debtBalanceRaw.toString(), { isDebt: true });
        const tokens = [collateralTokenBalance, debtTokenBalance];
        return tokens;
      },
    });
  }
}
