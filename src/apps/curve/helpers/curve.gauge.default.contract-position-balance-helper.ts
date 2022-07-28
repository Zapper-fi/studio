import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import {
  CurveChildLiquidityGauge,
  CurveContractFactory,
  CurveDoubleGauge,
  CurveGauge,
  CurveGaugeV2,
  CurveNGauge,
  CurveRewardsOnlyGauge,
} from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

import { CurveGaugeType } from './curve.gauge.registry';

type CurveGaugeDefaultContractPositionBalanceHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class CurveGaugeDefaultContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
  ) {}

  async getPositions(params: CurveGaugeDefaultContractPositionBalanceHelperParams) {
    if (params.network !== Network.ETHEREUM_MAINNET) {
      return Promise.all([
        this.getChildLiquidityGaugeContractPositionBalances(params),
        this.getRewardOnlyGaugeContractPositionBalances(params),
      ]).then(v => v.flat());
    }

    return Promise.all([
      this.getSingleGaugeContractPositionBalances(params),
      this.getDoubleGaugeContractPositionBalances(params),
      this.getNGaugeContractPositionBalances(params),
      this.getGaugeV4ContractPositionBalances(params),
    ]).then(v => v.flat());
  }

  private async getSingleGaugeContractPositionBalances({
    address,
    network,
  }: CurveGaugeDefaultContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveGauge>({
      address,
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.gauge.id,
      farmFilter: farm => farm.dataProps.implementation === CurveGaugeType.SINGLE,
      resolveContract: ({ address, network }) => this.curveContractFactory.curveGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) =>
        multicall.wrap(contract).claimable_tokens(address),
    });
  }

  private async getDoubleGaugeContractPositionBalances({
    address,
    network,
  }: CurveGaugeDefaultContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveDoubleGauge>({
      address,
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.gauge.id,
      farmFilter: farm => farm.dataProps.implementation === CurveGaugeType.DOUBLE,
      resolveContract: ({ address, network }) => this.curveContractFactory.curveDoubleGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: async ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        const primaryRewardBalance = await wrappedContract.claimable_tokens(address);
        const rewardBalances = [primaryRewardBalance.toString()];

        if (rewardTokens.length > 1) {
          const [secondaryRewardBalanceTotal, secondaryRewardBalanceClaimed] = await Promise.all([
            wrappedContract.claimable_reward(address),
            wrappedContract.claimed_rewards_for(address),
          ]);

          const secondaryRewardBalance = this.appToolkit
            .getBigNumber(secondaryRewardBalanceTotal)
            .minus(this.appToolkit.getBigNumber(secondaryRewardBalanceClaimed))
            .toFixed(0);
          rewardBalances.push(secondaryRewardBalance);
        }

        return rewardBalances;
      },
    });
  }

  private async getNGaugeContractPositionBalances({
    address,
    network,
  }: CurveGaugeDefaultContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveNGauge>({
      address,
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.gauge.id,
      farmFilter: farm => farm.dataProps.implementation === CurveGaugeType.N_GAUGE,
      resolveContract: ({ address, network }) => this.curveContractFactory.curveNGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: async ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        const primaryRewardBalance = await wrappedContract.claimable_tokens(address);
        const rewardBalances = [primaryRewardBalance];

        if (rewardTokens.length > 1) {
          const secondaryRewardBalance = await wrappedContract.claimable_reward(address, rewardTokens[1].address);
          rewardBalances.push(secondaryRewardBalance);
        }

        return rewardBalances;
      },
    });
  }

  private async getGaugeV4ContractPositionBalances({
    address,
    network,
  }: CurveGaugeDefaultContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveGaugeV2>({
      address,
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.gauge.id,
      farmFilter: farm => farm.dataProps.implementation === CurveGaugeType.GAUGE_V4,
      resolveContract: ({ address, network }) => this.curveContractFactory.curveGaugeV2({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        return Promise.all(rewardTokens.map(v => wrappedContract.claimable_reward_write(address, v.address)));
      },
    });
  }

  private async getChildLiquidityGaugeContractPositionBalances({
    address,
    network,
  }: CurveGaugeDefaultContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveChildLiquidityGauge>({
      address,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.gauge.id,
      network,
      farmFilter: v => v.dataProps.implementation === CurveGaugeType.GAUGE_V4,
      resolveContract: ({ address, network }) =>
        this.curveContractFactory.curveChildLiquidityGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: async ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const otherRewardTokens = rewardTokens.filter(v => v.symbol !== 'CRV');

        return Promise.all([
          multicall.wrap(contract).callStatic.claimable_tokens(address),
          ...otherRewardTokens.map(v => multicall.wrap(contract).claimable_reward(address, v.address)),
        ]);
      },
    });
  }

  private async getRewardOnlyGaugeContractPositionBalances({
    address,
    network,
  }: CurveGaugeDefaultContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<CurveRewardsOnlyGauge>({
      address,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.gauge.id,
      network,
      farmFilter: v => v.dataProps.implementation === CurveGaugeType.REWARDS_ONLY,
      resolveContract: ({ address, network }) => this.curveContractFactory.curveRewardsOnlyGauge({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall, contractPosition }) => {
        const rewardTokens = contractPosition.tokens.filter(isClaimable);
        const wrappedContract = multicall.wrap(contract);
        return Promise.all(rewardTokens.map(v => wrappedContract.claimable_reward_write(address, v.address)));
      },
    });
  }
}
