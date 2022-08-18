import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
  UnderlyingTokenDescriptor,
} from '~position/template/contract-position.template.position-fetcher';

import { BadgerContractFactory, BadgerTree } from '../contracts';

import { BadgerClaimableRewardsResolver } from './badger.claimable.rewards-resolver';

export type BadgerClaimableDescriptor = {
  address: string;
  rewardTokenAddress: string;
};

export abstract class BadgerClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  BadgerTree,
  DefaultDataProps,
  BadgerClaimableDescriptor
> {
  abstract diggTokenAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BadgerContractFactory) protected readonly contractFactory: BadgerContractFactory,
    @Inject(BadgerClaimableRewardsResolver)
    protected readonly badgerClaimableRewardsResolver: BadgerClaimableRewardsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BadgerTree {
    return this.contractFactory.badgerTree({ network: this.network, address });
  }

  async getTokenDescriptors(
    param: TokenStageParams<BadgerTree, DefaultDataProps, BadgerClaimableDescriptor>,
  ): Promise<UnderlyingTokenDescriptor[]> {
    return [{ address: param.descriptor.rewardTokenAddress, metaType: MetaType.CLAIMABLE }];
  }

  async getLabel(params: DisplayPropsStageParams<BadgerTree>): Promise<string> {
    const suppliedToken = params.contractPosition.tokens[0];
    return `Claimable ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesPerPositionParams<BadgerTree, DefaultDataProps>): Promise<BigNumberish[]> {
    const rewardToken = contractPosition.tokens[0];
    const accumulatedRewardsData = await this.badgerClaimableRewardsResolver.getVaultDefinitions({
      address,
      network: this.network,
    });

    const match = accumulatedRewardsData.find(v => v.rewardTokenAddress === rewardToken?.address);
    if (!match) return [0];
    let cumulativeAmount = match.rewardTokenBalanceRaw;

    let claimed = await contract.claimed(address, rewardToken.address).then(v => v.toString());
    if (rewardToken.symbol === this.diggTokenAddress) {
      const diggTokenContract = this.contractFactory.badgerDiggToken(rewardToken);
      const sharesPerFragment = await multicall.wrap(diggTokenContract)._sharesPerFragment();
      cumulativeAmount = new BigNumber(cumulativeAmount)
        .dividedBy(new BigNumber(sharesPerFragment.toString()))
        .toFixed(0);
      claimed = new BigNumber(claimed).dividedBy(new BigNumber(sharesPerFragment.toString())).toFixed(0);
    }

    const claimableBalanceRaw = new BigNumber(cumulativeAmount).minus(claimed).toFixed(0);
    return [claimableBalanceRaw];
  }
}
