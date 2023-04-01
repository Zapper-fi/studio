import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { LlamaAirforceContractFactory, LlamaAirforceMerkleDistributor } from '../contracts';

import { EthereumLlamaAirforceMerkleCache } from './llama-airforce.merkle-cache';

export type LlamaAirforceAirdropDefinition = {
  address: string;
  rewardTokenAddress: string;
};

@PositionTemplate()
export class EthereumLlamaAirforceAirdropContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LlamaAirforceMerkleDistributor> {
  groupLabel = 'Airdrop';

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

  async getDefinitions(): Promise<LlamaAirforceAirdropDefinition[]> {
    return [
      {
        address: '0x2c5e808fca6d8299ce194e12ed728f0fdbbf06c8',
        rewardTokenAddress: '0xde2bef0a01845257b4aef2a2eaa48f6eaeafa8b7', // uCRV
      },
      {
        address: '0x5682a28919389b528ae74dd627e0d632ca7e398c',
        rewardTokenAddress: '0x3a886455e5b33300a31c5e77bac01e76c0c7b29c', // uFXS
      },

      {
        address: '0x27a11054b62c29c166f3fab2b0ac708043b0cb49',
        rewardTokenAddress: '0x8659fc767cad6005de79af65dafe4249c57927af', // uCVX
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<LlamaAirforceMerkleDistributor, LlamaAirforceAirdropDefinition>) {
    return [{ metaType: MetaType.CLAIMABLE, address: definition.rewardTokenAddress, network: this.network }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LlamaAirforceMerkleDistributor>) {
    const claimableToken = contractPosition.tokens.find(isClaimable)!;
    return `Claimable ${getLabelFromToken(claimableToken)}`;
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
