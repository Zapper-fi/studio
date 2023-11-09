import { Inject } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { MerkleTemplateContractPositionFetcher } from '~position/template/merkle.template.contract-position-fetcher';
import { Network } from '~types';

import { GearboxViemContractFactory } from '../contracts';
import { AirdropDistributor } from '../contracts/viem';

import { EthereumGearboxRewardsMerkleCache, AIRDROP_DISTRIBUTOR, GEAR_TOKEN } from './gearbox.rewards.merkle-cache';

@PositionTemplate()
export class EthereumGearboxRewardsPositionFetcher extends MerkleTemplateContractPositionFetcher<AirdropDistributor> {
  groupLabel = 'rewards';
  merkleAddress = AIRDROP_DISTRIBUTOR;
  network = Network.ETHEREUM_MAINNET;

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GearboxViemContractFactory) protected readonly contractFactory: GearboxViemContractFactory,
    @Inject(EthereumGearboxRewardsMerkleCache) private readonly merkleCache: EthereumGearboxRewardsMerkleCache,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.airdropDistributor({ address, network: this.network });
  }

  async getRewardTokenAddresses() {
    return [GEAR_TOKEN];
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<AirdropDistributor>) {
    const rewardsData = await this.merkleCache.getClaim(GEAR_TOKEN, ethers.utils.getAddress(address));
    if (!rewardsData) return [0];

    const { amount } = rewardsData;
    const totalClaimed = await contract.read.claimed([address]);
    return [BigNumber.from(amount).sub(totalClaimed)];
  }
}
