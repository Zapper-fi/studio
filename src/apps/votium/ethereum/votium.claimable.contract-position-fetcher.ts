import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VotiumRewardsToken } from '../helpers/votium.rewards.balance-helper';
import { VOTIUM_DEFINITION } from '../votium.definition';

const appId = VOTIUM_DEFINITION.id;
const groupId = VOTIUM_DEFINITION.groups.claimable.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumVotiumClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const rewardTokenAddresses = await Axios.get<VotiumRewardsToken[]>(
      'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/activeTokens.json',
    ).then(v => v.data.map(v => v.value.toLowerCase()));

    return this.appToolkit.helpers.merkleContractPositionHelper.getContractPositions({
      address: '0x378ba9b73309be80bf4c2c027aad799766a7ed5a',
      appId,
      groupId,
      network,
      rewardTokenAddresses,
    });
  }
}
