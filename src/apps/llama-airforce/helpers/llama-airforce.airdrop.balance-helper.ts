import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import BigNumber from 'bignumber.js';
import { getAddress } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LlamaAirforceContractFactory } from '../contracts';
import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

type LlamaAirforceAirdropBalancesParams = {
  address: string;
};

type LlamaAirforceAirdropClaim = {
  index: number;
  amount: string;
  proof: string[];
};

type LlamaAirforceAirdropAirdropData = {
  merkleRoot: string;
  tokenTotal: string;
  claims: Record<string, LlamaAirforceAirdropClaim>;
};

const appId = LLAMA_AIRFORCE_DEFINITION.id;
const groupId = LLAMA_AIRFORCE_DEFINITION.groups.airdrop;
const network = Network.ETHEREUM_MAINNET;

@Injectable()
export class LlamaAirforceAirdropBalancesHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LlamaAirforceContractFactory) private readonly llamaAirforceContractFactory: LlamaAirforceContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${appId}:${groupId}:${network}:airdrop-data`,
    timeout: 15 * 60 * 1000,
  })
  private async getCachedAirdropData() {
    return Axios.get<LlamaAirforceAirdropAirdropData>(
      'https://raw.githubusercontent.com/0xAlunara/Llama-Airforce-Airdrops/master/ucrv/latest.json',
    ).then(v => v.data.claims);
  }

  async getBalances({ address }: LlamaAirforceAirdropBalancesParams) {
    const checksumAddress = getAddress(address);
    const airdropData = await this.getCachedAirdropData();
    if (!airdropData[checksumAddress]) return [];
    const { index, amount } = airdropData[checksumAddress];

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: LLAMA_AIRFORCE_DEFINITION.id,
      groupId: LLAMA_AIRFORCE_DEFINITION.groups.airdrop.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ contractPosition, multicall }) => {
        const contract = this.llamaAirforceContractFactory.llamaAirforceMerkleDistributor(contractPosition);
        const rewardToken = contractPosition.tokens.find(isClaimable)!;
        const isClaimed = await multicall.wrap(contract).isClaimed(index);
        const balanceRaw = new BigNumber(isClaimed ? '0' : amount);
        return [drillBalance(rewardToken, balanceRaw.toFixed(0))];
      },
    });
  }
}
