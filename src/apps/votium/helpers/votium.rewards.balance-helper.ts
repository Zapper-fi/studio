import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import BigNumber from 'bignumber.js';
import { getAddress } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { VotiumContractFactory } from '../contracts';
import { VOTIUM_DEFINITION } from '../votium.definition';

type VotiumRewardsBalancesParams = {
  address: string;
};

type VotiumRewardsClaim = {
  index: number;
  amount: string;
  proof: string[];
};

type VotiumRewardsTokens = {
  value: string;
  label: string;
  symbol: string;
  decimals: uint8;
};

type VotiumRewardsRewardsData = {
  merkleRoot: string;
  tokenTotal: string;
  claims: Record<string, VotiumRewardsClaim>;
};

const appId = VOTIUM_DEFINITION.id;
const groupId = VOTIUM_DEFINITION.groups.rewards;
const network = Network.ETHEREUM_MAINNET;

@Injectable()
export class VotiumRewardsBalancesHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VotiumContractFactory) private readonly votiumContractFactory: VotiumContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${appId}:${groupId}:${network}:rewards-data`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedRewardsData() {
		try {
			const tokens = await Axios.get<VotiumRewardTokens>(
	      'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/activeTokens.json',
	    ).then(v => v.data);
			var rewards = {};
			await Promise.all(
				tokens.map(async tok => {
					rewards[tok.value] = await Axios.get<VotiumRewardsRewardsData>(
						'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/'+tok.symbol+'/'+tok.symbol+'.json',
					).then(v => v.data.claims);
				})
			)

			return rewards;

		} catch(e) {
			console.log(e);
			return [];
		}
  }

  async getBalances({ address }: VotiumRewardsBalancesParams) {

		const VLCVX_MERKLE_ADDRESS = "0x378Ba9B73309bE80BF4C2c027aAD799766a7ED5A"
		const baseTokens = await this.appToolkit.getAppContractPositions({
      appId: VOTIUM_DEFINITION.id,
      groupIds: [VOTIUM_DEFINITION.groups.claimable.id],
      network,
    });
		const rewardsData = await this.getCachedRewardsData();
		const checksumAddress = getAddress(address);

		return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
			address,
			appId: VOTIUM_DEFINITION.id,
			groupId: VOTIUM_DEFINITION.groups.claimable.id,
			network: Network.ETHEREUM_MAINNET,
			resolveBalances: async ({ contractPosition, multicall }) => {
				const contract = this.votiumContractFactory.votiumMultiMerkle(contractPosition);
				const rewardToken = contractPosition.tokens.find(isClaimable);

				if (!rewardsData[rewardToken.address]) {
					return [drillBalance(rewardToken, '0')];
				}
				if (!rewardsData[rewardToken.address][checksumAddress]) {
					return [drillBalance(rewardToken, '0')];
				}
				if (!rewardsData[rewardToken.address][checksumAddress].index) {
					return [drillBalance(rewardToken, '0')];
				}
				const { index, amount } = rewardsData[rewardToken.address][checksumAddress];
				const isClaimed = await multicall.wrap(contract).isClaimed(rewardToken.address, index);

				const balanceRaw = new BigNumber(isClaimed ? '0' : amount);
				return [drillBalance(rewardToken, balanceRaw.toFixed(0))];
			},
		})
  }
}
