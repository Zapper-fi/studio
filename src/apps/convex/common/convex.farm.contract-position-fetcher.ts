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

import { ConvexViemContractFactory } from '../contracts';
import { ConvexSingleStakingRewards } from '../contracts/viem/ConvexSingleStakingRewards';

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
    @Inject(ConvexViemContractFactory) protected readonly contractFactory: ConvexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.convexSingleStakingRewards({ address, network: this.network });
  }

  getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<ConvexSingleStakingRewards>) {
    return contract.read.stakingToken();
  }

  async getRewardTokenAddresses({ multicall, contract }: GetTokenDefinitionsParams<ConvexSingleStakingRewards>) {
    // CRV rewarded, CVX minted
    const primaryRewardTokenAddresses = [
      '0xd533a949740bb3306d119cc777fa900ba034cd52', // CRV
      '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', // CVX
    ];

    // Extra rewards
    const numExtraRewards = await contract.read.extraRewardsLength();
    const extraRewardTokenAddresses = await Promise.all(
      range(0, Number(numExtraRewards)).map(async v => {
        const vbpAddress = await contract.read.extraRewards([BigInt(v)]);
        const vbp = this.contractFactory.convexVirtualBalanceRewardPool({ address: vbpAddress, network: this.network });
        const rewardTokenAddressRaw = await multicall.wrap(vbp).read.rewardToken();
        let rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();

        const stashTokenWrapper = this.contractFactory.convexStashTokenWrapper({
          address: rewardTokenAddress,
          network: this.network,
        });

        const isWrapper = await multicall
          .wrap(stashTokenWrapper)
          .read.booster()
          .then(() => true)
          .catch(() => false);

        if (isWrapper) {
          const rewardTokenAddressRaw = await multicall.wrap(stashTokenWrapper).read.token();
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

    const cvxTokenContract = this.appToolkit.globalViemContracts.erc20(cvxRewardToken);
    const cvxSupplyRaw = await multicall.wrap(cvxTokenContract).read.totalSupply();

    const crvRewardRate = await multicall.wrap(contract).read.rewardRate();
    let cvxRewardRate = claimedCrvToMintedCvx(crvRewardRate.toString(), cvxSupplyRaw.toString());

    const numExtraRewards = await multicall.wrap(contract).read.extraRewardsLength();
    const extraRewardRates = await Promise.all(
      range(0, Number(numExtraRewards)).map(async v => {
        const vbpAddress = await multicall.wrap(contract).read.extraRewards([BigInt(v)]);

        const vbpContract = this.contractFactory.convexVirtualBalanceRewardPool({
          address: vbpAddress,
          network: Network.ETHEREUM_MAINNET,
        });

        const extraRewardRate = await multicall.wrap(vbpContract).read.rewardRate();
        const extraRewardTokenAddressRaw = await multicall.wrap(vbpContract).read.rewardToken();
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
    return contract.read.balanceOf([address]);
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

    const cvxTokenContract = multicall.wrap(this.appToolkit.globalViemContracts.erc20(cvxRewardToken));
    const currentCvxSupply = await cvxTokenContract.read.totalSupply();

    const crvBalanceBN = await contract.read.earned([address]);
    const crvBalanceRaw = crvBalanceBN.toString();
    let cvxBalanceRaw = claimedCrvToMintedCvx(crvBalanceRaw, currentCvxSupply.toString());

    const numExtraRewards = await multicall.wrap(contract).read.extraRewardsLength();
    const extraRewardBalances = await Promise.all(
      range(0, Number(numExtraRewards)).map(async (_, i) => {
        const vbpAddress = await contract.read.extraRewards([BigInt(i)]);

        const vbpContract = this.contractFactory.convexVirtualBalanceRewardPool({
          address: vbpAddress,
          network: this.network,
        });

        const earnedBN = await multicall.wrap(vbpContract).read.earned([address]);
        const extraRewardTokenAddressRaw = await multicall.wrap(vbpContract).read.rewardToken();
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
