import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { PoolTogetherV3ViemContractFactory } from '../contracts';
import { PoolTogetherV3TokenFaucet } from '../contracts/viem';

import { PoolTogetherV3ApiPrizePoolRegistry } from './pool-together-v3.api.prize-pool-registry';

export abstract class PoolTogetherV3ClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PoolTogetherV3TokenFaucet> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ViemContractFactory) private readonly contractFactory: PoolTogetherV3ViemContractFactory,
    @Inject(PoolTogetherV3ApiPrizePoolRegistry)
    private readonly poolTogetherV3ApiPrizePoolRegistry: PoolTogetherV3ApiPrizePoolRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.poolTogetherV3TokenFaucet({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const prizePools = await this.poolTogetherV3ApiPrizePoolRegistry.getV3PrizePools(this.network);
    return prizePools.flatMap(prizePool =>
      prizePool.tokenFaucets.map(tokenFaucet => ({ address: tokenFaucet.tokenFaucetAddress.toLowerCase() })),
    );
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<PoolTogetherV3TokenFaucet, DefaultContractPositionDefinition>): Promise<
    UnderlyingTokenDefinition[] | null
  > {
    const rewardTokenAddressRaw = await contract.read.asset().then(addr => addr.toLowerCase());
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: rewardTokenAddressRaw,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PoolTogetherV3TokenFaucet>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<PoolTogetherV3TokenFaucet>): Promise<BigNumberish[]> {
    const claimableBalanceRaw = await contract.simulate.claim([address]).then(v => v.result);
    return [claimableBalanceRaw];
  }
}
