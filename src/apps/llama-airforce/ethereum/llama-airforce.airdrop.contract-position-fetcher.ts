import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable } from '~position/position.utils';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { MerkleTemplateContractPositionFetcher } from '~position/template/merkle.template.contract-position-fetcher';

import { LlamaAirforceContractFactory, LlamaAirforceMerkleDistributor } from '../contracts';

import { EthereumLlamaAirforceMerkleCache } from './llama-airforce.merkle-cache';

@PositionTemplate()
export class EthereumLlamaAirforceAirdropContractPositionFetcher extends MerkleTemplateContractPositionFetcher<LlamaAirforceMerkleDistributor> {
  groupLabel = 'Airdrop';
  merkleAddress = '0xa83043df401346a67eddeb074679b4570b956183';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LlamaAirforceContractFactory) protected readonly contractFactory: LlamaAirforceContractFactory,
    @Inject(EthereumLlamaAirforceMerkleCache) private readonly merkleCache: EthereumLlamaAirforceMerkleCache,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LlamaAirforceMerkleDistributor {
    return this.contractFactory.llamaAirforceMerkleDistributor({ address, network: this.network });
  }

  async getRewardTokenAddresses() {
    return [
      '0x83507cc8c8b67ed48badd1f59f684d5d02884c81', // uCRV
      '0xf964b0e3ffdea659c44a5a52bc0b82a24b89ce0e', // uFXS
      '0x8659fc767cad6005de79af65dafe4249c57927af', // uCVX
    ];
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<LlamaAirforceMerkleDistributor>) {
    const rewardToken = contractPosition.tokens.find(isClaimable)!;
    const rewardsData = await this.merkleCache.getClaim(rewardToken.address, address);
    if (!rewardsData) return [0];

    const { index, amount } = rewardsData;
    const isClaimed = await contract.isClaimed(index);
    if (isClaimed) return [0];

    return [amount];
  }
}
