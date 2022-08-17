import { Inject } from '@nestjs/common';

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

import { CurveContractFactory, CurveDoubleGauge } from '../contracts';
import { CurveGaugeType } from '../curve.types';
import { CurveGaugeRegistry } from '../helpers/curve.gauge.registry';

export abstract class CurveDoubleGaugeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<CurveDoubleGauge> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveGaugeRegistry) protected readonly curveGaugeRegistry: CurveGaugeRegistry,
  ) {
    super(appToolkit);
  }

  abstract crvTokenAddress: string;

  getContract(address: string): CurveDoubleGauge {
    return this.contractFactory.curveDoubleGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const allGauges = await this.curveGaugeRegistry.getGaugeDefinitions(this.network);
    return allGauges.filter(v => v.gaugeType === CurveGaugeType.CHILD).map(v => v.gaugeAddress);
  }

  async getStakedTokenAddress(contract: CurveDoubleGauge) {
    return contract.lp_token();
  }

  async getRewardTokenAddresses(contract: CurveDoubleGauge) {
    const bonusRewardTokenAddress = await contract.rewarded_token();
    return [this.crvTokenAddress, bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({
    contractPosition,
    contract,
  }: DataPropsStageParams<CurveDoubleGauge, SingleStakingFarmDataProps>) {
    const [inflationRate, workingSupply, relativeWeight] = await Promise.all([
      contract.inflation_rate(),
      contract.working_supply(),
      contract['gauge_relative_weight(address)'](contractPosition.address),
    ]);

    return inflationRate.mul(relativeWeight).mul(0.4).div(workingSupply);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<CurveDoubleGauge, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesPerPositionParams<CurveDoubleGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const primaryRewardBalance = await contract.claimable_tokens(address);
    const rewardBalances = [primaryRewardBalance.toString()];

    if (rewardTokens.length > 1) {
      const [secondaryRewardBalanceTotal, secondaryRewardBalanceClaimed] = await Promise.all([
        contract.claimable_reward(address),
        contract.claimed_rewards_for(address),
      ]);

      const secondaryRewardBalance = this.appToolkit
        .getBigNumber(secondaryRewardBalanceTotal)
        .minus(this.appToolkit.getBigNumber(secondaryRewardBalanceClaimed))
        .toFixed(0);

      rewardBalances.push(secondaryRewardBalance);
    }

    return rewardBalances;
  }
}
