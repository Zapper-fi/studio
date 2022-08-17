import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { CurveGauge, CurveContractFactory } from '../contracts';
import { CurveGaugeType } from '../curve.types';
import { CurveGaugeRegistry } from '../helpers/curve.gauge.registry';

export abstract class CurveSingleGaugeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<CurveGauge> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveGaugeRegistry) protected readonly curveGaugeRegistry: CurveGaugeRegistry,
  ) {
    super(appToolkit);
  }

  abstract crvTokenAddress: string;

  getContract(address: string): CurveGauge {
    return this.contractFactory.curveGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const allGauges = await this.curveGaugeRegistry.getGaugeDefinitions(this.network);
    return allGauges.filter(v => v.gaugeType === CurveGaugeType.CHILD).map(v => v.gaugeAddress);
  }

  async getStakedTokenAddress(contract: CurveGauge) {
    return contract.lp_token();
  }

  async getRewardTokenAddresses(_contract: CurveGauge) {
    return this.crvTokenAddress;
  }

  async getRewardRates({ contractPosition, contract }: DataPropsStageParams<CurveGauge, SingleStakingFarmDataProps>) {
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
  }: GetTokenBalancesPerPositionParams<CurveGauge, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<CurveGauge, SingleStakingFarmDataProps>) {
    return contract.claimable_tokens(address);
  }
}
