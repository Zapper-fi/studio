import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { isClaimable } from '~position/position.utils';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { CurveRewardsOnlyGauge, CurveContractFactory } from '../contracts';
import { CurveGaugeType } from '../curve.types';
import { CurveGaugeRegistry } from '../helpers/curve.gauge.registry';

export abstract class CurveRewardsOnlyGaugeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<CurveRewardsOnlyGauge> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveGaugeRegistry) protected readonly curveGaugeRegistry: CurveGaugeRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CurveRewardsOnlyGauge {
    return this.contractFactory.curveRewardsOnlyGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const allGauges = await this.curveGaugeRegistry.getGaugeDefinitions(this.network);
    return allGauges.filter(v => v.gaugeType === CurveGaugeType.REWARDS_ONLY).map(v => v.gaugeAddress);
  }

  async getStakedTokenAddress(contract: CurveRewardsOnlyGauge) {
    return contract.lp_token();
  }

  async getRewardTokenAddresses(contract: CurveRewardsOnlyGauge) {
    const rewardTokenAddresses = await Promise.all(range(0, 4).map(async i => contract.reward_tokens(i)));
    return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({ contractPosition }: DataPropsStageParams<CurveRewardsOnlyGauge, SingleStakingFarmDataProps>) {
    // Rewards only gauges are deprecated and no longer emit tokens
    return contractPosition.tokens.filter(isClaimable).map(() => 0);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<CurveRewardsOnlyGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesPerPositionParams<CurveRewardsOnlyGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(v => contract.claimable_reward(address, v.address)));
  }
}
