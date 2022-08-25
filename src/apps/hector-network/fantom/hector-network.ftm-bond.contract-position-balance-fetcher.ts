import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isClaimable, isVesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.ftmBond.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class FantomHectorNetworkFtmBondContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) private readonly contractFactory: HectorNetworkContractFactory,
  ) {}

  async getBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      network,
      appId,
      address,
      groupId: HECTOR_NETWORK_DEFINITION.groups.ftmBond.id,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const contract = this.contractFactory.hectorNetworkFtmBondDepository(contractPosition);
        const vestingToken = contractPosition.tokens.find(isVesting);
        const claimableToken = contractPosition.tokens.find(isClaimable);
        if (!vestingToken || !claimableToken) return [];

        const count = await multicall.wrap(contract).depositCounts(address);
        const depositIds = await Promise.all(
          Array(count.toNumber()).map((_, i) => multicall.wrap(contract).ownedDeposits(address, i)),
        );
        const bondInfos = await Promise.all(depositIds.map(id => multicall.wrap(contract).bondInfo(id)));
        const claimablePayouts = await Promise.all(depositIds.map(id => multicall.wrap(contract).pendingPayoutFor(id)));

        let totalPayout = BigNumber.from(0);
        let totalClaimablePayout = BigNumber.from(0);
        bondInfos.forEach(info => (totalPayout = totalPayout.add(info.payout)));
        claimablePayouts.forEach(payout => (totalClaimablePayout = totalClaimablePayout.add(payout)));

        return [
          drillBalance(vestingToken, totalPayout.sub(totalClaimablePayout).toString()),
          drillBalance(claimableToken, totalClaimablePayout.toString()),
        ];
      },
    });
  }
}
