import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LlamaAirforceContractFactory } from '../contracts';
import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

import { EthereumLlamaAirforceMerkleCache } from './llama-airforce.merkle-cache';

const appId = LLAMA_AIRFORCE_DEFINITION.id;
const groupId = LLAMA_AIRFORCE_DEFINITION.groups.airdrop.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class EthereumLlamaAirforceAirdropContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(EthereumLlamaAirforceMerkleCache)
    private readonly merkleCache: EthereumLlamaAirforceMerkleCache,
    @Inject(LlamaAirforceContractFactory) private readonly contractFactory: LlamaAirforceContractFactory,
  ) {}

  async getBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId,
      network,
      resolveBalances: async ({ contractPosition, multicall }) => {
        const contract = this.contractFactory.llamaAirforceMerkleDistributor(contractPosition);
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const rewardsData = await this.merkleCache.getClaim(rewardToken.address, address);
        if (!rewardsData) return [drillBalance(rewardToken, '0')];

        const { index, amount } = rewardsData;
        const isClaimed = await multicall.wrap(contract).isClaimed(index);

        const balanceRaw = new BigNumber(isClaimed ? '0' : amount);
        return [drillBalance(rewardToken, balanceRaw.toFixed(0))];
      },
    });
  }
}
