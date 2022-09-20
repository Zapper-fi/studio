import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AURA_DEFINITION, AuraContractFactory } from '~apps/aura';
import { AuraBaseRewardPoolDataProps } from '~apps/aura/aura.types';
import { AuraBaseRewardPool } from '~apps/aura/contracts';
import { SynthetixSingleStakingIsActiveStrategy, SynthetixSingleStakingRoiStrategy } from '~apps/synthetix';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types';

type GetRewardsDataPropsParams = {
  network: Network;
  rewardPools: string[];
};

type GetBaseRewardPoolContractPositionsParams = {
  appId: string;
  groupId: string;
  network: Network;
  dependencies: AppGroupsDefinition[];
  rewardPools: string[];
};

type GetAuraMintedForRewardTokenParams = {
  rewardTokenAmount: BigNumber;
  network: Network;
};

type GetAuraRewardRateParams = {
  rewardRate: BigNumber;
  network: Network;
};

@Injectable()
export class AuraBaseRewardPoolHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly auraContractFactory: AuraContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly isActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy) private readonly roiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getBaseRewardPoolContractPositions({
    appId,
    groupId,
    network,
    dependencies,
    rewardPools,
  }: GetBaseRewardPoolContractPositionsParams) {
    // Get the reward tokens and extra rewards up front because we need some
    // extra dataProps in order to resolve earned rewards across base reward
    // pools and virtual reward pools
    const rewardsDataProps = await this.getRewardsDataProps({ rewardPools, network });

    const contractPositions: ContractPosition[] =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<AuraBaseRewardPool>({
        network,
        appId,
        groupId,
        dependencies,
        resolveFarmContract: ({ address, network }) =>
          this.auraContractFactory.auraBaseRewardPool({ address, network }),
        resolveFarmAddresses: () => rewardPools,
        resolveLiquidity: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
        resolveIsActive: this.isActiveStrategy.build<AuraBaseRewardPool>({
          resolvePeriodFinish: ({ contract, multicall }) => multicall.wrap(contract).periodFinish(),
        }),
        resolveRewardTokenAddresses: async ({ contract }) => {
          const rewards = rewardsDataProps.find(r => r.rewardPool === contract.address)!;
          const { rewardToken, extraRewards } = rewards;
          return [rewardToken, AURA_DEFINITION.token!.address, ...extraRewards.map(r => r.rewardToken)];
        },
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).stakingToken(),
        resolveRois: opts => {
          const strategy = this.roiStrategy.build<AuraBaseRewardPool>({
            resolveRewardRates: async ({ contract, multicall }) => {
              // Platform reward (e.g. BAL)
              const rewardRate = await contract.rewardRate();

              const { extraRewards } = rewardsDataProps.find(r => r.rewardPool === contract.address)!;

              // AURA reward and extra rewards
              const otherRewardRates = await Promise.all([
                this.getAuraRewardRate({ network, rewardRate }),
                ...extraRewards.map(({ address }) =>
                  multicall
                    .wrap(this.auraContractFactory.auraVirtualBalanceRewardPool({ address, network }))
                    .rewardRate(),
                ),
              ]);

              return [rewardRate, ...otherRewardRates];
            },
          });
          return strategy(opts);
        },
      });

    return contractPositions.map<ContractPosition<AuraBaseRewardPoolDataProps>>(
      ({ dataProps, ...contractPosition }) => {
        const { extraRewards, rewardToken } = rewardsDataProps.find(r => r.rewardPool === contractPosition.address)!;
        return {
          ...contractPosition,
          dataProps: { ...dataProps, extraRewards, rewardToken },
        };
      },
    );
  }

  async getAuraMintedForRewardToken({ rewardTokenAmount, network }: GetAuraMintedForRewardTokenParams) {
    // All values are static/immutable
    const maxSupply = BigNumber.from(10).pow(26);
    const initMintAmount = BigNumber.from(10).pow(25).mul(5);
    const emissionsMaxSupply = BigNumber.from(10).pow(25).mul(5);
    const totalCliffs = BigNumber.from(500);
    const reductionPerCliff = emissionsMaxSupply.div(totalCliffs);

    const contract = this.auraContractFactory.auraToken({ address: AURA_DEFINITION.token!.address, network });
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

  private async getAuraRewardRate({ rewardRate, network }: GetAuraRewardRateParams) {
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

  private async getRewardsDataProps({
    rewardPools,
    network,
  }: GetRewardsDataPropsParams): Promise<
    { rewardPool: string; rewardToken: string; extraRewards: { address: string; rewardToken: string }[] }[]
  > {
    const multicall = this.appToolkit.getMulticall(network);

    return Promise.all(
      rewardPools.map(async rewardPool => {
        const contract = this.auraContractFactory.auraBaseRewardPool({ address: rewardPool, network });

        const extraRewardsLength = Number(await contract.extraRewardsLength());

        let extraRewards: { address: string; rewardToken: string }[] = [];

        if (extraRewardsLength > 0) {
          const indexes = [...Array(extraRewardsLength).keys()];
          const extraRewardsAddresses = await Promise.all(
            indexes.map(index => multicall.wrap(contract).extraRewards(index)),
          );
          const extraRewardTokens = await Promise.all(
            extraRewardsAddresses
              .map(address => this.auraContractFactory.auraVirtualBalanceRewardPool({ address, network }))
              .map(contract => multicall.wrap(contract).rewardToken()),
          );
          extraRewards = extraRewardsAddresses.map((address, index) => ({
            address: address.toLowerCase(),
            rewardToken: extraRewardTokens[index].toLowerCase(),
          }));
        }

        const rewardToken = (await multicall.wrap(contract).rewardToken()).toLowerCase();

        return { rewardPool, rewardToken, extraRewards };
      }),
    );
  }
}
