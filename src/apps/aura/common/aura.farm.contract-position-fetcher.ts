import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
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

import { AuraViemContractFactory } from '../contracts';
import { AuraBaseRewardPool } from '../contracts/viem';

export type AuraPoolSingleStakingFarmDataProps = {
  liquidity: number;
  apy: number;
  isActive: boolean;
  extraRewards: {
    address: string;
    rewardToken: string;
  }[];
};

// AURA is minted whenever BAL is claimed
// See: https://docs.convexfinance.com/convexfinanceintegration/cvx-minting
export const claimedBalToMintedAura = (claimedBalAmount: string, currentAuraSupply: string) => {
  const claimedBalAmountBN = BigNumber.from(claimedBalAmount);
  const currentAuraSupplyBN = BigNumber.from(currentAuraSupply);

  // All values are static/immutable
  const maxSupply = BigNumber.from(10).pow(26);
  const initMintAmount = BigNumber.from(10).pow(25).mul(5);
  const emissionsMaxSupply = BigNumber.from(10).pow(25).mul(5);
  const totalCliffs = BigNumber.from(500);
  const reductionPerCliff = emissionsMaxSupply.div(totalCliffs);

  const emissionsMinted = currentAuraSupplyBN.sub(initMintAmount);

  // e.g. reductionPerCliff = 5e25 / 500 = 1e23
  // e.g. cliff = 1e25 / 1e23 = 100
  const cliff = emissionsMinted.div(reductionPerCliff);

  // e.g. 100 < 500
  if (cliff.lt(totalCliffs)) {
    // e.g. (new) reduction = (500 - 100) * 2.5 + 700 = 1700;
    // e.g. (new) reduction = (500 - 250) * 2.5 + 700 = 1325;
    // e.g. (new) reduction = (500 - 400) * 2.5 + 700 = 950;
    const reduction = totalCliffs.sub(cliff).mul(5).div(2).add(700);
    // e.g. (new) amount = 1e19 * 1700 / 500 =  34e18;
    // e.g. (new) amount = 1e19 * 1325 / 500 =  26.5e18;
    // e.g. (new) amount = 1e19 * 950 / 500  =  19e17;
    let amount = claimedBalAmountBN.mul(reduction).div(totalCliffs);

    // e.g. amtTillMax = 5e25 - 1e25 = 4e25
    const amtTillMax = maxSupply.sub(emissionsMinted);
    if (amount.gt(amtTillMax)) {
      amount = amtTillMax;
    }

    return amount;
  }

  return BigNumber.from(0);
};

export abstract class AuraFarmContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<AuraBaseRewardPool> {
  abstract boosterMultiplierAddress: string;

  abstract balancerTokenAddress: string;
  abstract auraTokenAddress: string;
  isBoosterLite = this.network !== Network.ETHEREUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraViemContractFactory) protected readonly contractFactory: AuraViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.auraBaseRewardPool({ network: this.network, address });
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<AuraBaseRewardPool>) {
    return contract.read.stakingToken();
  }

  async getRewardTokenAddresses({ contract, multicall }: GetTokenDefinitionsParams<AuraBaseRewardPool>) {
    const extraRewardTokenAddresses = await Promise.all(
      range(0, Number(await contract.read.extraRewardsLength())).map(async v => {
        const vbpAddress = await contract.read.extraRewards([BigInt(v)]);
        const vbp = this.contractFactory.auraVirtualBalanceRewardPool({ address: vbpAddress, network: this.network });
        const stashTokenAddressRaw = await multicall.wrap(vbp).read.rewardToken();
        let rewardTokenAddress = stashTokenAddressRaw.toLowerCase();

        const stashTokenContract = this.contractFactory.auraStashToken({
          address: rewardTokenAddress,
          network: this.network,
        });

        const isStash = await multicall
          .wrap(stashTokenContract)
          .read.stash()
          .then(() => true)
          .catch(() => false);

        if (isStash) {
          const rewardTokenAddressRaw = await multicall.wrap(stashTokenContract).read.baseToken();
          rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
        }

        // We will combine AURA extra rewards with the amount minted
        if (rewardTokenAddress === this.auraTokenAddress) return null;

        return rewardTokenAddress;
      }),
    );

    return [this.balancerTokenAddress, this.auraTokenAddress, ...compact(extraRewardTokenAddresses)];
  }

  async getRewardRates({
    contract,
    multicall,
  }: GetDataPropsParams<AuraBaseRewardPool, SingleStakingFarmDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const auraTokenContract = this.appToolkit.globalViemContracts.erc20({
      address: this.auraTokenAddress,
      network: this.network,
    });
    const auraSupplyRaw = await multicall.wrap(auraTokenContract).read.totalSupply();

    const balRewardRate = await multicall.wrap(contract).read.rewardRate();
    const auraRewardRate = claimedBalToMintedAura(balRewardRate.toString(), auraSupplyRaw.toString());

    const numExtraRewards = await multicall.wrap(contract).read.extraRewardsLength().then(Number);
    const extraRewardRates = await Promise.all(
      range(0, numExtraRewards).map(async v => {
        const vbpAddress = await multicall.wrap(contract).read.extraRewards([BigInt(v)]);
        const vbp = this.contractFactory.auraVirtualBalanceRewardPool({ address: vbpAddress, network: this.network });
        return multicall.wrap(vbp).read.rewardRate();
      }),
    );

    return [balRewardRate, auraRewardRate, ...extraRewardRates];
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<AuraBaseRewardPool>) {
    return contract.read.balanceOf([address]);
  }

  async getRewardTokenBalances({
    address,
    contract,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<AuraBaseRewardPool>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const [, auraRewardToken] = rewardTokens;

    const auraTokenContract = multicall.wrap(this.appToolkit.globalViemContracts.erc20(auraRewardToken));
    const currentAuraSupply = await auraTokenContract.read.totalSupply();

    const balBalanceBN = await contract.read.earned([address]);
    const balBalanceRaw = balBalanceBN.toString();
    const auraBalanceMintedRaw = claimedBalToMintedAura(balBalanceRaw, currentAuraSupply.toString());
    const boosterMultiplierContract = this.contractFactory.auraBoosterV2({
      address: this.boosterMultiplierAddress,
      network: this.network,
    });

    let auraBalanceRaw: BigNumber;

    if (!this.isBoosterLite) {
      const [rewardMultiplierDenominator, rewardMultipleRaw] = await Promise.all([
        multicall.wrap(boosterMultiplierContract).read.REWARD_MULTIPLIER_DENOMINATOR(),
        multicall.wrap(boosterMultiplierContract).read.getRewardMultipliers([contractPosition.address]),
      ]);
      auraBalanceRaw = auraBalanceMintedRaw.mul(rewardMultipleRaw).div(rewardMultiplierDenominator);
    } else {
      auraBalanceRaw = auraBalanceMintedRaw;
    }

    const numExtraRewards = await multicall.wrap(contract).read.extraRewardsLength();
    const extraRewardBalances = await Promise.all(
      range(0, Number(numExtraRewards)).map(async (_, i) => {
        const extraRewardAddress = await contract.read.extraRewards([BigInt(i)]);
        const extraRewardContract = this.contractFactory.auraVirtualBalanceRewardPool({
          address: extraRewardAddress,
          network: this.network,
        });

        const earnedBN = await multicall.wrap(extraRewardContract).read.earned([address]);
        const extraRewardStashTokenAddressRaw = await multicall.wrap(extraRewardContract).read.rewardToken();
        let extraRewardStashTokenAddress = extraRewardStashTokenAddressRaw.toLowerCase();
        const stashTokenContract = this.contractFactory.auraStashToken({
          address: extraRewardStashTokenAddress,
          network: this.network,
        });

        const isStash = await multicall
          .wrap(stashTokenContract)
          .read.stash()
          .then(() => true)
          .catch(() => false);

        if (isStash) {
          const extraRewardTokenAddressRaw = await multicall.wrap(stashTokenContract).read.baseToken();
          extraRewardStashTokenAddress = extraRewardTokenAddressRaw.toLowerCase();
        }

        // We will combine AURA extra rewards with the amount minted
        if (extraRewardStashTokenAddress === auraRewardToken.address) {
          auraBalanceRaw = auraBalanceRaw.add(earnedBN);
          return null;
        }

        return earnedBN;
      }),
    );

    return [balBalanceRaw, auraBalanceRaw, ...compact(extraRewardBalances)];
  }
}
