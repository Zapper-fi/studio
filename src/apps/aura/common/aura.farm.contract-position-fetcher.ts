import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { range } from 'lodash';

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

import { AuraBaseRewardPool, AuraContractFactory } from '../contracts';

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
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory)
    protected readonly contractFactory: AuraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraBaseRewardPool {
    return this.contractFactory.auraBaseRewardPool({ network: this.network, address });
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<AuraBaseRewardPool>) {
    return contract.stakingToken();
  }

  async getRewardTokenAddresses({ contract, multicall }: GetTokenDefinitionsParams<AuraBaseRewardPool>) {
    // BAL rewarded, AURA minted
    const primaryRewardTokenAddresses = [
      '0xba100000625a3754423978a60c9317c58a424e3d', // BAL
      '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf', // AURA
    ];

    // Extra rewards
    const extraRewardTokenAddresses = await Promise.all(
      range(0, Number(await contract.extraRewardsLength())).map(async v => {
        const vbpAddress = await contract.extraRewards(v);
        const vbp = this.contractFactory.auraVirtualBalanceRewardPool({ address: vbpAddress, network: this.network });
        return multicall.wrap(vbp).rewardToken();
      }),
    );

    return [...primaryRewardTokenAddresses, ...extraRewardTokenAddresses];
  }

  async getRewardRates({
    contract,
    multicall,
    contractPosition,
  }: GetDataPropsParams<AuraBaseRewardPool, SingleStakingFarmDataProps>): Promise<BigNumberish | BigNumberish[]> {
    const auraToken = contractPosition.tokens.find(v => v.symbol === 'AURA')!;
    const auraTokenContract = this.contractFactory.erc20(auraToken);
    const auraSupplyRaw = await multicall.wrap(auraTokenContract).totalSupply();

    const balRewardRate = await multicall.wrap(contract).rewardRate();
    const auraRewardRate = claimedBalToMintedAura(balRewardRate.toString(), auraSupplyRaw.toString());

    const numExtraRewards = await multicall.wrap(contract).extraRewardsLength().then(Number);
    const extraRewardRates = await Promise.all(
      range(0, numExtraRewards).map(async v => {
        const vbpAddress = await multicall.wrap(contract).extraRewards(v);
        const vbp = this.contractFactory.auraVirtualBalanceRewardPool({ address: vbpAddress, network: this.network });
        return multicall.wrap(vbp).rewardRate();
      }),
    );

    return [balRewardRate, auraRewardRate, ...extraRewardRates];
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<AuraBaseRewardPool>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({
    address,
    contract,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<AuraBaseRewardPool>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const [, auraRewardToken, ...extraRewards] = rewardTokens;

    const auraTokenContract = multicall.wrap(this.contractFactory.erc20(auraRewardToken));
    const currentAuraSupply = await auraTokenContract.totalSupply();

    const balBalanceBN = await contract.earned(address);
    const balBalanceRaw = balBalanceBN.toString();
    const auraBalanceRaw = claimedBalToMintedAura(balBalanceRaw, currentAuraSupply.toString());

    const extraRewardBalances = await Promise.all(
      extraRewards.map(async (_, i) => {
        const extraRewardAddress = await contract.extraRewards(i);
        const extraRewardContract = this.contractFactory.auraVirtualBalanceRewardPool({
          address: extraRewardAddress,
          network: this.network,
        });

        const earnedBN = await multicall.wrap(extraRewardContract).earned(address);
        return earnedBN.toString();
      }),
    );

    return [balBalanceRaw, auraBalanceRaw, ...extraRewardBalances];
  }
}
