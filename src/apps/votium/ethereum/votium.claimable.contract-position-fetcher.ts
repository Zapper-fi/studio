import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { isClaimable } from '~position/position.utils';
import { GetTokenBalancesPerPositionParams } from '~position/template/contract-position.template.position-fetcher';
import { MerkleTemplateContractPositionFetcher } from '~position/template/merkle.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { VotiumContractFactory, VotiumMultiMerkle } from '../contracts';
import { VOTIUM_DEFINITION } from '../votium.definition';

import { EthereumVotiumMerkleCache, VotiumActiveTokenData } from './votium.merkle-cache';

const appId = VOTIUM_DEFINITION.id;
const groupId = VOTIUM_DEFINITION.groups.claimable.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumVotiumClaimableContractPositionFetcher extends MerkleTemplateContractPositionFetcher<VotiumMultiMerkle> {
  appId = appId;
  groupId = groupId;
  network = network;
  merkleAddress = '0x378ba9b73309be80bf4c2c027aad799766a7ed5a';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VotiumContractFactory) protected readonly contractFactory: VotiumContractFactory,
    @Inject(EthereumVotiumMerkleCache) private readonly merkleCache: EthereumVotiumMerkleCache,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VotiumMultiMerkle {
    return this.contractFactory.votiumMultiMerkle({ address, network: this.network });
  }

  async getRewardTokenAddresses() {
    const activeTokensUrl = 'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/activeTokens.json';
    const { data } = await Axios.get<VotiumActiveTokenData[]>(activeTokensUrl);
    return data.map(v => v.value.toLowerCase());
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesPerPositionParams<VotiumMultiMerkle>) {
    const rewardToken = contractPosition.tokens.find(isClaimable)!;
    const rewardsData = await this.merkleCache.getClaim(rewardToken.address, address);
    if (!rewardsData?.index) return [0];

    const { index, amount } = rewardsData;
    const isClaimed = await contract.isClaimed(rewardToken.address, index);
    return isClaimed ? [0] : [amount];
  }
}
