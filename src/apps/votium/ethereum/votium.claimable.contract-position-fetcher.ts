import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable } from '~position/position.utils';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { MerkleTemplateContractPositionFetcher } from '~position/template/merkle.template.contract-position-fetcher';

import { VotiumViemContractFactory } from '../contracts';
import { VotiumMultiMerkle } from '../contracts/viem';

import { EthereumVotiumMerkleCache, VotiumActiveTokenData } from './votium.merkle-cache';

@PositionTemplate()
export class EthereumVotiumClaimableContractPositionFetcher extends MerkleTemplateContractPositionFetcher<VotiumMultiMerkle> {
  groupLabel = 'Claimable';
  merkleAddress = '0x378ba9b73309be80bf4c2c027aad799766a7ed5a';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VotiumViemContractFactory) protected readonly contractFactory: VotiumViemContractFactory,
    @Inject(EthereumVotiumMerkleCache) private readonly merkleCache: EthereumVotiumMerkleCache,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
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
  }: GetTokenBalancesParams<VotiumMultiMerkle>) {
    const rewardToken = contractPosition.tokens.find(isClaimable)!;
    const rewardsData = await this.merkleCache.getClaim(rewardToken.address, address);
    if (!rewardsData?.index) return [0];

    const { index, amount } = rewardsData;
    const isClaimed = await contract.read.isClaimed([rewardToken.address, BigInt(index)]);
    return isClaimed ? [0] : [amount];
  }
}
