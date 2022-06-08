import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VotiumContractFactory } from '../contracts';
import { VOTIUM_DEFINITION } from '../votium.definition';

const appId = VOTIUM_DEFINITION.id;
const groupId = VOTIUM_DEFINITION.groups.claimable.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumVotiumClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VotiumContractFactory) private readonly votiumContractFactory: VotiumContractFactory,
  ) {}

	async getPositions() {
		const tokens = await Axios.get<VotiumRewardTokens>(
			'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/activeTokens.json',
		).then(v => v.data);
		const rewards = await Promise.all(
			tokens.map(async tok => {
				return tok.value;
			})
		);
    return this.appToolkit.helpers.merkleContractPositionHelper.getContractPositions({
      address: '0x378Ba9B73309bE80BF4C2c027aAD799766a7ED5A',
      appId,
      groupId,
      network,
      dependencies: [],
      rewardTokenAddresses: rewards,
    });
  }
}
