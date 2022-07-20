import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range, sum } from 'lodash';

import { SingleStakingFarmContractPositionHelperParams } from '~app-toolkit';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { WithMetaType } from '~position/display.interface';
import { Token } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveGaugeV2 } from '../contracts';
import { CurvePoolDefinition } from '../curve.types';

type GetRewardsInUsdOpts = {
  rewardStreamAddress: string;
  rewardTokens: WithMetaType<Token>[];
  multicall: IMulticallWrapper;
  network: Network;
};

type CurveRewardsOnlyGaugeRoiStrategyParams = {
  tokenDefinitions: CurvePoolDefinition[];
};

@Injectable()
export class CurveRewardsOnlyGaugeRoiStrategy {
  constructor(
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
  ) {}

  build({
    tokenDefinitions,
  }: CurveRewardsOnlyGaugeRoiStrategyParams): SingleStakingFarmContractPositionHelperParams<CurveGaugeV2>['resolveRois'] {
    return async ({ multicall, address, stakedToken, rewardTokens, network }) => {
      // Get the TVL of the pool to calculate the APY as a fraction
      const tokenContract = this.curveContractFactory.erc20({ address: stakedToken.address, network });
      const balanceRaw = await multicall.wrap(tokenContract).balanceOf(address);
      const balance = Number(balanceRaw) / 10 ** stakedToken.decimals;
      const balanceUSD = balance * stakedToken.price;

      // Find the reward stream for the gauge (these are defined statically because Curve doesn't always allow for dynamic retrieval)
      const tokenDefinition = tokenDefinitions.find(v => v.gaugeAddress === address);
      const rewardStreamAddress = tokenDefinition?.streamAddress;
      if (!rewardStreamAddress || tokenDefinition.streamEol) return { yearlyROI: 0, weeklyROI: 0, dailyROI: 0 };

      // Determine if its a multi reward stream, single reward stream, or pass through
      const multiRewardStreamContract = this.curveContractFactory.curveMultiRewardStream({
        address: rewardStreamAddress,
        network,
      });

      const isMultiRewardStream = await multicall
        .wrap(multiRewardStreamContract)
        .reward_count()
        .then(() => true)
        .catch(() => false);

      const rewardsInUSD = isMultiRewardStream
        ? await this.getMultiRewardTotalUSD({ multicall, rewardTokens, network, rewardStreamAddress })
        : await this.getSingleRewardTotalUSD({ multicall, rewardTokens, network, rewardStreamAddress });

      // Calculate the ROIs
      const yearlyROI = rewardsInUSD / balanceUSD;
      const weeklyROI = yearlyROI / 52;
      const dailyROI = yearlyROI / 365;
      return { dailyROI, weeklyROI, yearlyROI };
    };
  }

  private async getSingleRewardTotalUSD({
    rewardStreamAddress,
    multicall,
    rewardTokens,
    network,
  }: GetRewardsInUsdOpts) {
    // Single reward case; get the reward rate of the single reward stream
    const rewardStreamContract = this.curveContractFactory.curveSingleRewardStream({
      address: rewardStreamAddress,
      network,
    });

    const [rewardRate, rewardTokenAddressRaw] = await Promise.all([
      await multicall.wrap(rewardStreamContract).reward_rate(),
      await multicall.wrap(rewardStreamContract).reward_token(),
    ]);

    const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
    const rewardToken = rewardTokens.find(p => p.address === rewardTokenAddress);
    if (!rewardToken) return 0;

    return new BigNumber(rewardRate.toString())
      .dividedBy(10 ** rewardToken.decimals)
      .times(365 * 24 * 60 * 60)
      .times(rewardToken.price)
      .toNumber();
  }

  private async getMultiRewardTotalUSD({ rewardStreamAddress, multicall, rewardTokens, network }: GetRewardsInUsdOpts) {
    // @TODO Bonus APY for AAVE and GEIST tokens is not supported :(
    // See https://github.com/beefyfinance/beefy-api/blob/master/src/api/stats/fantom/getCurveApys.js for more details
    const rewardStreamContract = this.curveContractFactory.curveMultiRewardStream({
      address: rewardStreamAddress,
      network,
    });

    const rewardTokenCount = await multicall.wrap(rewardStreamContract).reward_count();
    const individualRewardsInUSD = await Promise.all(
      range(0, Number(rewardTokenCount)).map(async index => {
        const rewardTokenAddressRaw = await multicall.wrap(rewardStreamContract).reward_tokens(index);
        const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
        const rewardToken = rewardTokens.find(p => p.address === rewardTokenAddress);
        if (!rewardToken) return 0;

        const rewardData = await multicall.wrap(rewardStreamContract).reward_data(rewardTokenAddress);
        if (Number(rewardData.period_finish) < Date.now() / 1000) return 0;

        return new BigNumber(rewardData.rate.toString())
          .times(365 * 24 * 60 * 60)
          .times(rewardToken.price)
          .dividedBy(10 ** rewardToken.decimals)
          .toNumber();
      }),
    );

    return sum(individualRewardsInUSD);
  }
}
