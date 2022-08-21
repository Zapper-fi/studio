import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isClaimable } from '~position/position.utils';
import {
  TokenStageParams,
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';
import { Network } from '~types';

import { ConvexContractFactory } from '../contracts';
import { ConvexSingleStakingRewards } from '../contracts/ethers/ConvexSingleStakingRewards';

// CVX is minted whenever CRV is claimed
// See: https://docs.convexfinance.com/convexfinanceintegration/cvx-minting
export const claimedCrvToMintedCvx = (claimedCrvAmount: string, currentCvxSupply: string) => {
  const claimedCrvAmountBN = new BigNumber(claimedCrvAmount);
  const currentCvxSupplyBN = new BigNumber(currentCvxSupply);

  const tokensPerCliff = new BigNumber(100000).times(1e18);
  const maxCliffCount = new BigNumber(1000);
  const maxCvxSupply = new BigNumber(100000000).times(1e18);
  const currentCliff = currentCvxSupplyBN.div(tokensPerCliff);

  if (currentCliff.gte(maxCliffCount)) return '0';
  const remainingCliffs = maxCliffCount.minus(currentCliff);
  const remainingCliffRatio = remainingCliffs.div(maxCliffCount);
  const remainingCvxToMint = maxCvxSupply.minus(currentCvxSupplyBN);

  const maybeCvxRewardTokenBalanceRaw = remainingCliffRatio.times(claimedCrvAmountBN);
  const cvxRewardTokenBalanceRaw = maybeCvxRewardTokenBalanceRaw.gt(remainingCvxToMint)
    ? remainingCvxToMint
    : maybeCvxRewardTokenBalanceRaw;

  return cvxRewardTokenBalanceRaw.toFixed(0);
};

export abstract class ConvexFarmContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<ConvexSingleStakingRewards> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexSingleStakingRewards {
    return this.contractFactory.convexSingleStakingRewards({ address, network: this.network });
  }

  getStakedTokenAddress({ contract }: TokenStageParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>) {
    return contract.stakingToken();
  }

  async getRewardTokenAddresses({
    multicall,
    contract,
  }: TokenStageParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>) {
    // CRV rewarded, CVX minted
    const primaryRewardTokenAddresses = [
      '0xd533a949740bb3306d119cc777fa900ba034cd52', // CRV
      '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', // CVX
    ];

    // Extra rewards
    const numExtraRewards = await contract.extraRewardsLength();
    const extraRewardTokenAddresses = await Promise.all(
      range(0, Number(numExtraRewards)).map(async v => {
        const vbpAddress = await contract.extraRewards(v);
        const vbp = this.contractFactory.convexVirtualBalanceRewardPool({ address: vbpAddress, network: this.network });
        return multicall.wrap(vbp).rewardToken();
      }),
    );

    return [...primaryRewardTokenAddresses, ...extraRewardTokenAddresses];
  }

  async getRewardRates({
    contract,
    contractPosition,
    multicall,
  }: DataPropsStageParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>) {
    const cvxToken = contractPosition.tokens.find(v => v.symbol === 'CVX')!;
    const cvxTokenContract = this.contractFactory.erc20(cvxToken);
    const cvxSupplyRaw = await multicall.wrap(cvxTokenContract).totalSupply();

    const crvRewardRate = await multicall.wrap(contract).rewardRate();
    const cvxRewardRate = claimedCrvToMintedCvx(crvRewardRate.toString(), cvxSupplyRaw.toString());

    const numExtraRewards = await multicall.wrap(contract).extraRewardsLength().then(Number);
    const extraRewardRates = await Promise.all(
      range(0, numExtraRewards).map(async v => {
        const vbpAddress = await multicall.wrap(contract).extraRewards(v);

        const vbpContract = this.contractFactory.convexVirtualBalanceRewardPool({
          address: vbpAddress,
          network: Network.ETHEREUM_MAINNET,
        });

        return multicall.wrap(vbpContract).rewardRate();
      }),
    );

    return [crvRewardRate, cvxRewardRate, ...extraRewardRates];
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({
    address,
    contract,
    multicall,
    contractPosition,
  }: GetTokenBalancesPerPositionParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>): Promise<
    BigNumberish | BigNumberish[]
  > {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const [, cvxRewardToken, ...extraRewards] = rewardTokens;

    const cvxTokenContract = this.contractFactory.erc20(cvxRewardToken);
    const currentCvxSupply = await cvxTokenContract.totalSupply();

    const crvBalanceBN = await contract.earned(address);
    const crvBalanceRaw = crvBalanceBN.toString();
    const cvxBalanceRaw = claimedCrvToMintedCvx(crvBalanceRaw, currentCvxSupply.toString());

    const extraRewardBalances = await Promise.all(
      extraRewards.map(async (_, i) => {
        const extraRewardAddress = await contract.extraRewards(i);
        const extraRewardContract = this.contractFactory.convexVirtualBalanceRewardPool({
          address: extraRewardAddress,
          network: this.network,
        });

        const earnedBN = await multicall.wrap(extraRewardContract).earned(address);
        return earnedBN.toString();
      }),
    );

    return [crvBalanceRaw, cvxBalanceRaw, ...extraRewardBalances];
  }
}
