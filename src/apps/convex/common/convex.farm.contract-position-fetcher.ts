import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish, ethers } from 'ethers';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isClaimable } from '~position/position.utils';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';
import { Network } from '~types';

import { ConvexContractFactory } from '../contracts';
import { ConvexSingleStakingRewards } from '../contracts/ethers/ConvexSingleStakingRewards';

// CVX is minted whenever CRV is claimed.
// We're dealing with floating poing arithmetic, so use BigNumber.js, but return an ethers.BigNumber
// See: https://docs.convexfinance.com/convexfinanceintegration/cvx-minting
export const claimedCrvToMintedCvx = (claimedCrvAmount: string, currentCvxSupply: string) => {
  const claimedCrvAmountBN = new BigNumber(claimedCrvAmount);
  const currentCvxSupplyBN = new BigNumber(currentCvxSupply);

  const tokensPerCliff = new BigNumber(100000).times(1e18);
  const maxCliffCount = new BigNumber(1000);
  const maxCvxSupply = new BigNumber(100000000).times(1e18);
  const currentCliff = currentCvxSupplyBN.div(tokensPerCliff);

  if (currentCliff.gte(maxCliffCount)) return ethers.BigNumber.from(0);
  const remainingCliffs = maxCliffCount.minus(currentCliff);
  const remainingCliffRatio = remainingCliffs.div(maxCliffCount);
  const remainingCvxToMint = maxCvxSupply.minus(currentCvxSupplyBN);

  const maybeCvxRewardTokenBalanceRaw = remainingCliffRatio.times(claimedCrvAmountBN);
  const cvxRewardTokenBalanceRaw = maybeCvxRewardTokenBalanceRaw.gt(remainingCvxToMint)
    ? remainingCvxToMint
    : maybeCvxRewardTokenBalanceRaw;

  return ethers.BigNumber.from(cvxRewardTokenBalanceRaw.toFixed(0));
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

  getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<ConvexSingleStakingRewards>) {
    return contract.stakingToken();
  }

  async getRewardTokenAddresses({ multicall, contract }: GetTokenDefinitionsParams<ConvexSingleStakingRewards>) {
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
        const rewardTokenAddressRaw = await multicall.wrap(vbp).rewardToken();
        let rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();

        const stashTokenWrapper = this.contractFactory.convexStashTokenWrapper({
          address: rewardTokenAddress,
          network: this.network,
        });

        const isWrapper = await multicall
          .wrap(stashTokenWrapper)
          .booster()
          .then(() => true)
          .catch(() => false);

        if (isWrapper) {
          const rewardTokenAddressRaw = await multicall.wrap(stashTokenWrapper).token();
          rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
        }

        // We will combine CVX extra rewards with the amount minted
        if (rewardTokenAddress === primaryRewardTokenAddresses[1]) return null;

        return rewardTokenAddressRaw.toLowerCase();
      }),
    );

    return [...primaryRewardTokenAddresses, ...compact(extraRewardTokenAddresses)];
  }

  async getRewardRates({
    contract,
    contractPosition,
    multicall,
  }: GetDataPropsParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const [, cvxRewardToken] = rewardTokens;

    const cvxTokenContract = this.contractFactory.erc20(cvxRewardToken);
    const cvxSupplyRaw = await multicall.wrap(cvxTokenContract).totalSupply();

    const crvRewardRate = await multicall.wrap(contract).rewardRate();
    let cvxRewardRate = claimedCrvToMintedCvx(crvRewardRate.toString(), cvxSupplyRaw.toString());

    const numExtraRewards = await multicall.wrap(contract).extraRewardsLength();
    const extraRewardRates = await Promise.all(
      range(0, Number(numExtraRewards)).map(async v => {
        const vbpAddress = await multicall.wrap(contract).extraRewards(v);

        const vbpContract = this.contractFactory.convexVirtualBalanceRewardPool({
          address: vbpAddress,
          network: Network.ETHEREUM_MAINNET,
        });

        const extraRewardRate = await multicall.wrap(vbpContract).rewardRate();
        const extraRewardTokenAddressRaw = await multicall.wrap(vbpContract).rewardToken();
        const extraRewardTokenAddress = extraRewardTokenAddressRaw.toLowerCase();

        // We will combine CVX extra rewards with the amount minted
        if (extraRewardTokenAddress === cvxRewardToken.address) {
          cvxRewardRate = cvxRewardRate.add(extraRewardRate);
          return null;
        }

        return extraRewardRate;
      }),
    );

    return [crvRewardRate, cvxRewardRate, ...compact(extraRewardRates)];
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({
    address,
    contract,
    multicall,
    contractPosition,
  }: GetTokenBalancesParams<ConvexSingleStakingRewards, SingleStakingFarmDataProps>): Promise<
    BigNumberish | BigNumberish[]
  > {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const [, cvxRewardToken] = rewardTokens;

    const cvxTokenContract = multicall.wrap(this.contractFactory.erc20(cvxRewardToken));
    const currentCvxSupply = await cvxTokenContract.totalSupply();

    const crvBalanceBN = await contract.earned(address);
    const crvBalanceRaw = crvBalanceBN.toString();
    let cvxBalanceRaw = claimedCrvToMintedCvx(crvBalanceRaw, currentCvxSupply.toString());

    const numExtraRewards = await multicall.wrap(contract).extraRewardsLength();
    const extraRewardBalances = await Promise.all(
      range(0, Number(numExtraRewards)).map(async (_, i) => {
        const vbpAddress = await contract.extraRewards(i);

        const vbpContract = this.contractFactory.convexVirtualBalanceRewardPool({
          address: vbpAddress,
          network: this.network,
        });

        const earnedBN = await multicall.wrap(vbpContract).earned(address);
        const extraRewardTokenAddressRaw = await multicall.wrap(vbpContract).rewardToken();
        const extraRewardTokenAddress = extraRewardTokenAddressRaw.toLowerCase();

        // We will combine CVX extra rewards with the amount minted
        if (extraRewardTokenAddress === cvxRewardToken.address) {
          cvxBalanceRaw = cvxBalanceRaw.add(earnedBN);
          return null;
        }

        return earnedBN;
      }),
    );

    return [crvBalanceRaw, cvxBalanceRaw, ...compact(extraRewardBalances)];
  }
}
