import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { OriginDollarContractFactory } from '../contracts';

type OGVRewardsParams = {
  appId: string;
  groupId: string;
  network: Network;
  address: string;
};

@Injectable()
export class OGVRewardsBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarContractFactory) private readonly contractFactory: OriginDollarContractFactory,
  ) {}

  async getClaimableBalances({ appId, network, address }: OGVRewardsParams) {
    const multicall = this.appToolkit.getMulticall(network);

    // Retrieve reward position
    const [contractPosition] = await this.appToolkit.getAppContractPositions({
      network,
      appId,
      groupIds: ['rewards'],
    });

    if (!contractPosition) {
      return [];
    }

    const veogv = await this.contractFactory.veogv({
      network,
      address: contractPosition.address,
    });

    const balanceRaw = await multicall.wrap(veogv).previewRewards(address);
    const tokenBalance = drillBalance(contractPosition.tokens[0], balanceRaw.toString());

    const contractPositionBalance: ContractPositionBalance = {
      ...contractPosition,
      tokens: [tokenBalance],
      balanceUSD: tokenBalance.balanceUSD,
    };

    return [contractPositionBalance];
  }
}
