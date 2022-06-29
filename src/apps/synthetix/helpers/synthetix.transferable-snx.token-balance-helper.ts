import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixTransferableSnxTokenBalanceHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class SynthetixTransferrableSnxTokenBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  async getBalances({ address, network }: SynthetixTransferableSnxTokenBalanceHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: SYNTHETIX_DEFINITION.id,
      groupIds: [SYNTHETIX_DEFINITION.groups.transferableSnx.id],
      network,
    });

    const snxToken = appTokens.find(p => p.symbol === 'SNX');
    if (!snxToken) return [];

    const snxContract = this.contractFactory.synthetixNetworkToken(snxToken);
    const balanceRaw = await multicall.wrap(snxContract).transferableSynthetix(address);
    return [drillBalance(snxToken, balanceRaw.toString())];
  }
}
