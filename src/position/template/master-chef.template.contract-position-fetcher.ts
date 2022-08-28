import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { range, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractPosition, MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

export type MasterChefContractPositionDataProps = {
  poolIndex: number;
  liquidity: number;
  isActive: boolean;
  apy: number;
};

export type MasterChefContractPositionDefinition = {
  address: string;
  poolIndex: number;
};

export type GetMasterChefDataPropsParams<T extends Contract> = GetDataPropsParams<
  T,
  MasterChefContractPositionDataProps,
  MasterChefContractPositionDefinition
>;

export type GetMasterChefTokenBalancesParams<T extends Contract> = GetTokenBalancesParams<
  T,
  MasterChefContractPositionDataProps
>;

export abstract class MasterChefTemplateContractPositionFetcher<
  T extends Contract,
  V extends MasterChefContractPositionDataProps = MasterChefContractPositionDataProps,
> extends ContractPositionTemplatePositionFetcher<T, V, MasterChefContractPositionDefinition> {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  abstract chefAddress: string;
  abstract getPoolLength(contract: T): Promise<BigNumberish>;

  // Tokens
  abstract getStakedTokenAddress(contract: T, poolIndex: number, multicall: IMulticallWrapper): Promise<string>;
  abstract getRewardTokenAddress(contract: T, poolIndex: number, multicall: IMulticallWrapper): Promise<string>;

  // APY
  rewardRateUnit: RewardRateUnit = RewardRateUnit.BLOCK;
  abstract getTotalAllocPoints(params: GetMasterChefDataPropsParams<T>): Promise<BigNumberish>;
  abstract getTotalRewardRate(params: GetMasterChefDataPropsParams<T>): Promise<BigNumberish>;
  abstract getPoolAllocPoints(params: GetMasterChefDataPropsParams<T>): Promise<BigNumberish>;

  // Balances
  abstract getStakedTokenBalance(params: GetMasterChefTokenBalancesParams<T>): Promise<BigNumberish>;
  abstract getRewardTokenBalance(params: GetMasterChefTokenBalancesParams<T>): Promise<BigNumberish>;

  async getDefinitions() {
    const contract = this.getContract(this.chefAddress);
    const poolLength = await this.getPoolLength(contract);
    return range(0, Number(poolLength)).map(poolIndex => ({ address: this.chefAddress, poolIndex }));
  }

  async getTokenDefinitions({
    contract,
    definition,
    multicall,
  }: GetTokenDefinitionsParams<T, MasterChefContractPositionDefinition>) {
    const tokenDefinitions: UnderlyingTokenDefinition[] = [];

    const stakedTokenAddress = await this.getStakedTokenAddress(contract, definition.poolIndex, multicall).catch(
      err => {
        if (isMulticallUnderlyingError(err)) return null;
        throw err;
      },
    );
    const rewardTokenAddress = await this.getRewardTokenAddress(contract, definition.poolIndex, multicall).catch(
      err => {
        if (isMulticallUnderlyingError(err)) return null;
        throw err;
      },
    );

    if (!stakedTokenAddress || !rewardTokenAddress) return null;

    tokenDefinitions.push({ metaType: MetaType.SUPPLIED, address: stakedTokenAddress });
    tokenDefinitions.push({ metaType: MetaType.CLAIMABLE, address: rewardTokenAddress });
    return tokenDefinitions;
  }

  async getReserve({ contractPosition, multicall }: GetDataPropsParams<T, V, MasterChefContractPositionDefinition>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const stakedTokenContract = this.appToolkit.globalContracts.erc20(stakedToken);
    const reserveRaw = await multicall.wrap(stakedTokenContract).balanceOf(contractPosition.address);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    return reserve;
  }

  async getRewardRates(
    params: GetDataPropsParams<T, V, MasterChefContractPositionDefinition>,
  ): Promise<BigNumberish[]> {
    const [totalAllocPoints, totalRewardRateRaw, poolAllocPoints] = await Promise.all([
      this.getTotalAllocPoints(params),
      this.getTotalRewardRate(params),
      this.getPoolAllocPoints(params),
    ]);

    const rewardRate = BigNumber.from(totalRewardRateRaw).mul(poolAllocPoints).div(totalAllocPoints);

    return [rewardRate];
  }

  async getDataProps(params: GetDataPropsParams<T, V, MasterChefContractPositionDefinition>): Promise<V> {
    const { contractPosition, definition } = params;
    const poolIndex = definition.poolIndex;
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    const reserve = await this.getReserve(params);
    const rewardRates = await this.getRewardRates(params);
    const liquidity = reserve * stakedToken.price;

    const normalizedRewardRates = rewardTokens.map((rt, i) => Number(rewardRates[i] ?? 0) / 10 ** rt.decimals);
    const rewardRateUSD = sum(rewardTokens.map((rt, i) => normalizedRewardRates[i] * rt.price));
    const multiplier = this.rewardRateUnit === RewardRateUnit.BLOCK ? BLOCKS_PER_DAY[this.network] : 86400;
    const dailyRewardRateUSD = rewardRateUSD * multiplier;

    const dailyReturn = (dailyRewardRateUSD + liquidity) / liquidity - 1;
    const apy = dailyReturn * 365 * 100;
    const isActive = apy > 0;

    return { poolIndex, liquidity, apy, isActive } as V;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    return getLabelFromToken(stakedToken);
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<T, V>) {
    return contractPosition.tokens.filter(isSupplied).flatMap(v => getImagesFromToken(v));
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<V> }): string {
    return this.appToolkit.getPositionKey(contractPosition, ['poolIndex']);
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<T, MasterChefContractPositionDataProps>) {
    const tokenBalances: BigNumberish[] = [];

    const [stakedBalanceRaw, rewardTokenBalanceRaw] = await Promise.all([
      this.getStakedTokenBalance(params),
      this.getRewardTokenBalance(params),
    ]);

    tokenBalances.push(stakedBalanceRaw);
    tokenBalances.push(rewardTokenBalanceRaw);
    return tokenBalances;
  }
}
