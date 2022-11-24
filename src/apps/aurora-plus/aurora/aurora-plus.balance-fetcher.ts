import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { AURORA_PLUS_DEFINITION } from '../aurora-plus.definition';
import { AuroraPlusContractFactory } from '../contracts';

const network = Network.AURORA_MAINNET;

@Register.BalanceFetcher(AURORA_PLUS_DEFINITION.id, network)
export class AuroraAuroraPlusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuroraPlusContractFactory) protected readonly contractFactory: AuroraPlusContractFactory,
  ) {}

  async getStakingBalance(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: AURORA_PLUS_DEFINITION.id,
      groupId: AURORA_PLUS_DEFINITION.groups.stake.id,
      network,
      resolveBalances: async ({ address, multicall, contractPosition }) => {
        const contract = this.contractFactory.staking(contractPosition);
        const streamCount = await multicall.wrap(contract).getStreamsCount();
        const streamIDs = range(0, streamCount.toNumber());
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardTokens = contractPosition.tokens.filter(isClaimable);

        const rewardTokenValues = await Promise.all(
          streamIDs.map(streamID => multicall.wrap(contract).getPending(streamID, address)),
        );

        const depositAmount = await multicall.wrap(contract).getUserTotalDeposit(address);
        const rewardBalance = rewardTokens.map((token, id) => {
          return drillBalance(token, rewardTokenValues[id].toString());
        });

        return [drillBalance(stakedToken, depositAmount.toString()), ...rewardBalance];
      },
    });
  }

  async getBalances(address: string) {
    const tokenBalances = await this.getStakingBalance(address);

    return presentBalanceFetcherResponse([{ label: 'Staked Aurora', assets: tokenBalances }]);
  }
}
