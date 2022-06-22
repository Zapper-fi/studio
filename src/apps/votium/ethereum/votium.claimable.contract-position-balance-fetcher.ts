import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { VotiumContractFactory } from '../contracts';
import { VOTIUM_DEFINITION } from '../votium.definition';

import { EthereumVotiumMerkleCache } from './votium.merkle-cache';

@Register.ContractPositionBalanceFetcher({
  appId: VOTIUM_DEFINITION.id,
  groupId: VOTIUM_DEFINITION.groups.claimable.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumVotiumClaimableContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(EthereumVotiumMerkleCache)
    private readonly merkleCache: EthereumVotiumMerkleCache,
    @Inject(VotiumContractFactory) private readonly votiumContractFactory: VotiumContractFactory,
  ) {}

  async getBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: VOTIUM_DEFINITION.id,
      groupId: VOTIUM_DEFINITION.groups.claimable.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ contractPosition, multicall }) => {
        const contract = this.votiumContractFactory.votiumMultiMerkle(contractPosition);
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const rewardsData = await this.merkleCache.getClaim(rewardToken.address, address);
        if (!rewardsData?.index) return [drillBalance(rewardToken, '0')];

        const { index, amount } = rewardsData;
        const isClaimed = await multicall.wrap(contract).isClaimed(rewardToken.address, index);

        const balanceRaw = new BigNumber(isClaimed ? '0' : amount);
        return [drillBalance(rewardToken, balanceRaw.toFixed(0))];
      },
    });
  }
}
