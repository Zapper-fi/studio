import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AuraContractFactory } from '../contracts';

type GetAuraMintedForRewardTokenParams = {
  rewardTokenAmount: BigNumber;
  network: Network;
};

type GetAuraRewardRateParams = {
  rewardRate: BigNumber;
  network: Network;
};

const AURA_BAL_ADDRESS = '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d';

@Injectable()
export class AuraBaseRewardPoolUtils {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly contractFactory: AuraContractFactory,
  ) {}

  async getAuraRewardRate({ rewardRate, network }: GetAuraRewardRateParams) {
    if (rewardRate.eq(0)) {
      return BigNumber.from(0);
    }

    // Annualise rewardRate to get an amount of reward token earned per year
    const secondsPerYear = 86400 * 7 * 365;
    const rewardTokenAmount = rewardRate.mul(secondsPerYear);

    // Get the AURA amount minted for that period
    const auraRewardRate = await this.getAuraMintedForRewardToken({ rewardTokenAmount, network });

    // Get per-second value (i.e. the AURA reward rate)
    if (auraRewardRate.gt(0)) {
      return auraRewardRate.div(secondsPerYear);
    }
    return auraRewardRate;
  }

  async getAuraMintedForRewardToken({ rewardTokenAmount, network }: GetAuraMintedForRewardTokenParams) {
    // All values are static/immutable
    const maxSupply = BigNumber.from(10).pow(26);
    const initMintAmount = BigNumber.from(10).pow(25).mul(5);
    const emissionsMaxSupply = BigNumber.from(10).pow(25).mul(5);
    const totalCliffs = BigNumber.from(500);
    const reductionPerCliff = emissionsMaxSupply.div(totalCliffs);

    const contract = this.contractFactory.auraToken({ address: AURA_BAL_ADDRESS, network });
    const totalSupply = await contract.totalSupply();

    const emissionsMinted = totalSupply.sub(initMintAmount);

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
      let amount = rewardTokenAmount.mul(reduction).div(totalCliffs);

      // e.g. amtTillMax = 5e25 - 1e25 = 4e25
      const amtTillMax = maxSupply.sub(emissionsMinted);
      if (amount.gt(amtTillMax)) {
        amount = amtTillMax;
      }

      return amount;
    }

    return BigNumber.from(0);
  }
}
