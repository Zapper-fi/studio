import { Contract } from '@ethersproject/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import _, { compact, isArray, toLower } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, ContractPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { claimable, supplied } from '~position/position.utils';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { buildDollarDisplayItem, buildPercentageDisplayItem } from '../presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '../presentation/image.present';

import {
  MasterChefDefaultRewardRateStrategy,
  MasterChefDefaultRewardRateStrategyParams,
} from './master-chef.default.reward-token-reward-rate-strategy';

export type MasterChefContractStrategy<T> = (opts: { address: string; network: Network }) => T;

export type MasterChefRewardAddressStrategy<T> = (opts: { contract: T; poolIndex: number }) => string | Promise<string>;

export type MasterChefPoolLengthStrategy<T> = (opts: {
  network: Network;
  contract: T;
  multicall: Multicall;
}) => BigNumberish | Promise<BigNumberish>;

export type MasterChefPoolIndexIsValidStrategy<T> = (opts: {
  contract: T;
  multicall: Multicall;
  poolIndex: number;
}) => Promise<boolean>;

export type MasterChefEndBlockStrategy<T> = (opts: {
  contract: T;
  multicall: Multicall;
  poolIndex: number;
}) => Promise<number>;

export type MasterChefDespositTokenAddressStrategy<T> = (opts: {
  contract: T;
  multicall: Multicall;
  poolIndex: number;
  network: Network;
}) => Promise<string>;

export type MasterChefRewardTokenAddressesStrategy<T> = (opts: {
  contract: T;
  multicall: Multicall;
  poolIndex: number;
  network: Network;
}) => Promise<string | string[]>;

export type MasterChefRewardRateStrategy<T> = (opts: {
  network: Network;
  contract: T;
  address: string;
  multicall: Multicall;
  depositTokenAddress: string;
  poolIndex: number;
  baseTokens: BaseToken[];
  appTokens: AppTokenPosition[];
}) => Promise<number | number[] | BigNumber | BigNumber[]>;

export type MasterChefTotalValueLockedStrategy<T> = (opts: {
  contract: T;
  address: string;
  network: Network;
  multicall: Multicall;
  depositTokenAddress: string;
  poolIndex: number;
  baseTokens: BaseToken[];
  appTokens: AppTokenPosition[];
}) => Promise<BigNumberish>;

export enum RewardRateUnit {
  BLOCK = 'block',
  SECOND = 'second',
}

export type MasterChefLabelStrategy = (opts: { stakedToken: Token; rewardTokens: Token[] }) => string;

type MasterChefContractPositionHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  minimumTvl?: number;
  dependencies?: AppGroupsDefinition[];
  rewardRateUnit?: RewardRateUnit;
  resolveContract: MasterChefContractStrategy<T>;
  resolveAddress?: MasterChefRewardAddressStrategy<T>;
  resolvePoolLength: MasterChefPoolLengthStrategy<T>;
  resolvePoolIndexIsValid?: MasterChefPoolIndexIsValidStrategy<T>;
  resolveEndBlock?: MasterChefEndBlockStrategy<T>;
  resolveDepositTokenAddress: MasterChefDespositTokenAddressStrategy<T>;
  resolveRewardTokenAddresses: MasterChefRewardTokenAddressesStrategy<T>;
  resolveRewardRate?: MasterChefRewardRateStrategy<T>;
  resolveTotalValueLocked?: MasterChefTotalValueLockedStrategy<T>;
  resolveLabel?: MasterChefLabelStrategy;
};

export type MasterChefContractPositionDataProps = {
  poolIndex: number;
  totalValueLocked: number;
  isActive: boolean;
  dailyROI: number;
  weeklyROI: number;
  yearlyROI: number;
};

@Injectable()
export class MasterChefContractPositionHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MasterChefDefaultRewardRateStrategy)
    private readonly defaultRewardsPerBlockStrategy: MasterChefDefaultRewardRateStrategy,
  ) {}

  async getContractPositions<T>({
    address,
    network,
    appId,
    groupId,
    minimumTvl = 0,
    dependencies = [],
    rewardRateUnit = RewardRateUnit.BLOCK,
    resolveContract,
    resolvePoolLength,
    resolveDepositTokenAddress,
    resolveRewardTokenAddresses,
    resolveRewardRate = async () => 0,
    resolvePoolIndexIsValid = async () => true,
    resolveEndBlock = async () => 0,
    resolveTotalValueLocked = async ({ depositTokenAddress, address, multicall }) =>
      multicall
        .wrap(this.appToolkit.globalContracts.erc20({ network, address: depositTokenAddress }))
        .balanceOf(address),
    resolveAddress = async ({ contract }) => (contract as unknown as Contract).address,
    resolveLabel = ({ stakedToken }) => `Staked ${getLabelFromToken(stakedToken)}`,
  }: MasterChefContractPositionHelperParams<T>): Promise<ContractPosition<MasterChefContractPositionDataProps>[]> {
    const provider = this.appToolkit.getNetworkProvider(network);
    const multicall = this.appToolkit.getMulticall(network);

    // Resolve the current block, base tokens, and dependency app tokens
    const [currentBlock, baseTokens, appTokens] = await Promise.all([
      provider.getBlockNumber(),
      this.appToolkit.getBaseTokenPrices(network),
      this.appToolkit.getAppTokenPositions(...dependencies),
    ]);

    // Resolve the number of pools in this Master Chef implementation
    const contract = resolveContract({ address, network });
    const numPools = await resolvePoolLength({ contract, multicall, network });

    const contractPositions = await Promise.all(
      _.range(0, Number(numPools)).flatMap(async poolIndex => {
        const type = ContractType.POSITION;
        const addressRaw = await resolveAddress({ poolIndex, contract });
        const address = addressRaw.toLowerCase();
        const isValid = await resolvePoolIndexIsValid({ contract, poolIndex, multicall });
        if (!isValid) return null;

        // Resolve end block of rewards
        const endBlock = await resolveEndBlock({ contract, multicall, poolIndex });

        // Resolve deposit token address
        const depositTokenAddress = await resolveDepositTokenAddress({
          network,
          contract,
          poolIndex,
          multicall,
        }).then(v => v.toLowerCase());

        // Resolve reward token addresses
        const rewardTokenAddresses = await resolveRewardTokenAddresses({
          network,
          multicall,
          poolIndex,
          contract,
        }).then(v => (isArray(v) ? v.map(toLower) : [v.toLowerCase()]));

        // Resolve deposit and reward tokens
        const allTokens = [...appTokens, ...baseTokens];
        const depositToken = allTokens.find(t => t.address === depositTokenAddress);
        const maybeRewardTokens = rewardTokenAddresses.map(v => allTokens.find(t => t.address === v));
        if (!depositToken) return null;

        // Resolve as much as we can about this token from on-chain data
        const rewardTokens = await Promise.all(
          maybeRewardTokens.map(async (maybeRewardToken, i) => {
            if (maybeRewardToken) return maybeRewardToken;

            const address = rewardTokenAddresses[i];
            const contract = this.appToolkit.globalContracts.erc20({ address, network });
            const [symbol, decimals] = await Promise.all([
              multicall.wrap(contract).symbol(),
              multicall.wrap(contract).decimals(),
            ]);

            const token: BaseToken = { type: ContractType.BASE_TOKEN, address, network, symbol, decimals, price: 0 };
            return token;
          }),
        );

        // Resolve total value locked
        const totalValueLockedRaw = await resolveTotalValueLocked({
          multicall,
          poolIndex,
          contract,
          address,
          network,
          depositTokenAddress,
          baseTokens,
          appTokens,
        }).then(v => Number(v));

        // Resolve reward token amounts per block
        const rewardsPerBlock = await resolveRewardRate({
          network,
          multicall,
          poolIndex,
          contract,
          address,
          depositTokenAddress,
          baseTokens,
          appTokens,
        }).then(v => (isArray(v) ? v.map(Number) : [Number(v)]));

        // Build tokens
        const stakedToken = supplied(depositToken);
        const claimableTokens = rewardTokens.map(t => claimable(t));
        const tokens = [stakedToken, ...claimableTokens];

        // Resolve daily, weekly, and yearly ROIs
        let dailyROI = 0;
        let weeklyROI = 0;
        let yearlyROI = 0;
        const isRewardsOver = endBlock > 0 && currentBlock >= endBlock;
        const isActive = !isRewardsOver && rewardsPerBlock.some(t => t > 0);
        const totalValueLocked = stakedToken.price * (Number(totalValueLockedRaw) / 10 ** stakedToken.decimals);

        if (totalValueLocked !== 0 && isActive) {
          const roisPerToken = rewardTokens.map((rewardToken, index) => {
            const rewardPerBlock = (rewardsPerBlock[index] ?? 0) / 10 ** rewardToken.decimals;
            const dailyRewardRate =
              rewardRateUnit === RewardRateUnit.BLOCK
                ? rewardPerBlock * BLOCKS_PER_DAY[network]
                : rewardPerBlock * 86_400;
            const dailyRewardRateUSD = dailyRewardRate * rewardToken.price;

            const dailyROI = (dailyRewardRateUSD + totalValueLocked) / totalValueLocked - 1;
            const weeklyROI = Number(dailyROI * 7);
            const yearlyROI = dailyROI * 365;
            return { dailyROI, weeklyROI, yearlyROI };
          });

          dailyROI = _.sumBy(roisPerToken, t => t.dailyROI);
          weeklyROI = _.sumBy(roisPerToken, t => t.weeklyROI);
          yearlyROI = _.sumBy(roisPerToken, t => t.yearlyROI);
        }

        // Resolve data properties
        const dataProps = { poolIndex, totalValueLocked, isActive, dailyROI, weeklyROI, yearlyROI };

        // Resolve display properties
        const label = resolveLabel({ stakedToken, rewardTokens });
        const secondaryLabel = buildDollarDisplayItem(stakedToken.price);
        const images = getImagesFromToken(stakedToken);
        const statsItems = [
          { label: 'ROI', value: buildPercentageDisplayItem(yearlyROI) },
          { label: 'TVL', value: buildDollarDisplayItem(totalValueLocked) },
        ];
        const displayProps = { label, secondaryLabel, images, statsItems };

        const position: ContractPosition<MasterChefContractPositionDataProps> = {
          type,
          address,
          network,
          appId,
          groupId,
          tokens,
          dataProps,
          displayProps,
        };

        return position;
      }),
    );

    return compact(contractPositions).filter(f => f.dataProps.totalValueLocked >= minimumTvl);
  }

  buildDefaultRewardsPerBlockStrategy<T>(opts: MasterChefDefaultRewardRateStrategyParams<T>) {
    return this.defaultRewardsPerBlockStrategy.build(opts);
  }
}
