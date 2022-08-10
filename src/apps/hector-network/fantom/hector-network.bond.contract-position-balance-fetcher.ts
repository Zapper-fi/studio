import { Inject } from '@nestjs/common';

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
const groupId = HECTOR_NETWORK_DEFINITION.groups.bond.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class FantomHectorNetworkBondContractPositionBalanceFetcher
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
      groupId: HECTOR_NETWORK_DEFINITION.groups.bond.id,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const contract = this.contractFactory.hectorNetworkBondDepository(contractPosition);
        const vestingToken = contractPosition.tokens.find(isVesting);
        const claimableToken = contractPosition.tokens.find(isClaimable);
        if (!vestingToken || !claimableToken) return [];

        const [bondInfo, claimablePayout] = await Promise.all([
          multicall.wrap(contract).bondInfo(address),
          multicall.wrap(contract).pendingPayoutFor(address),
        ]);

        return [
          drillBalance(vestingToken, bondInfo.payout.sub(claimablePayout).toString()),
          drillBalance(claimableToken, claimablePayout.toString()),
        ];
      },
    });
  }
}
