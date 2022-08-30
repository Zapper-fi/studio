import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { PoolTogetherV3ApiPrizePoolRegistry } from '~apps/pool-together-v3/helpers/pool-together-v3.api.prize-pool-registry';
import { ContractType } from '~position/contract.interface';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { PoolTogetherV3TokenFaucet, PoolTogetherV4ContractFactory } from '../contracts';

export abstract class PoolTogetherV4ClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PoolTogetherV3TokenFaucet> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV4ContractFactory) private readonly contractFactory: PoolTogetherV4ContractFactory,
    @Inject(PoolTogetherV3ApiPrizePoolRegistry)
    private readonly poolTogetherV3ApiPrizePoolRegistry: PoolTogetherV3ApiPrizePoolRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PoolTogetherV3TokenFaucet {
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
    const rewardTokenAddressRaw = await contract.asset();
    return [{ address: rewardTokenAddressRaw, metaType: MetaType.CLAIMABLE }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PoolTogetherV3TokenFaucet>) {
    const rewardToken = contractPosition.tokens[0];
    if (rewardToken.type === ContractType.APP_TOKEN) return `Claimable ${rewardToken.displayProps.label}`;
    return `Claimable ${rewardToken.symbol}`;
  }

  async getSecondaryLabel({
    contractPosition,
  }: GetDisplayPropsParams<PoolTogetherV3TokenFaucet>): Promise<DisplayProps['secondaryLabel']> {
    const claimableToken = contractPosition.tokens[0];
    return buildDollarDisplayItem(claimableToken.price);
  }

  async getImages({
    contractPosition,
  }: GetDisplayPropsParams<PoolTogetherV3TokenFaucet>): Promise<DisplayProps['images']> {
    const rewardToken = contractPosition.tokens[0];
    if (rewardToken.type === ContractType.APP_TOKEN) return rewardToken.displayProps.images;
    return [getTokenImg(rewardToken.address, this.network)];
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<PoolTogetherV3TokenFaucet>): Promise<BigNumberish[]> {
    const claimableBalanceRaw = await contract.callStatic.claim(address);
    return [claimableBalanceRaw];
  }
}
