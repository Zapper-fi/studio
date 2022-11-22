import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish, Contract, ethers } from 'ethers';
import { range, sum } from 'lodash';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveGauge } from '../contracts';

export enum GaugeType {
  SINGLE = 'single',
  DOUBLE = 'double',
  N_GAUGE = 'n-gauge',
  GAUGE_V4 = 'gauge-v4',
  CHILD = 'child-chain',
  REWARDS_ONLY = 'rewards-only',
}

export type CurvePoolGaugeDataProps = {
  liquidity: number;
  apy: number;
  isActive: boolean;
  gaugeType: GaugeType;
};

export type CurvePoolGaugeDefinition = {
  address: string;
  swapAddress: string;
  tokenAddress: string;
  gaugeType: GaugeType;
};

export type ResolvePoolCountParams<T extends Contract> = {
  registryContract: T;
  multicall: IMulticallWrapper;
};

export type ResolveSwapAddressParams<T extends Contract> = {
  registryContract: T;
  poolIndex: number;
  multicall: IMulticallWrapper;
};

export type ResolveTokenAddressParams<T extends Contract> = {
  registryContract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveGaugeAddressParams<T extends Contract> = {
  registryContract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveCoinAddressesParams<T extends Contract> = {
  registryContract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveReservesParams<T extends Contract> = {
  registryContract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveFeesParams<T extends Contract> = {
  registryContract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export abstract class CurvePoolGaugeContractPositionFetcher<
  T extends Contract,
> extends ContractPositionTemplatePositionFetcher<CurveGauge, CurvePoolGaugeDataProps, CurvePoolGaugeDefinition> {
  abstract registryAddress: string;
  abstract crvTokenAddress: string;
  controllerAddress = ''; // ETH network only

  abstract resolveRegistry(address: string): T;
  abstract resolvePoolCount(params: ResolvePoolCountParams<T>): Promise<BigNumberish>;
  abstract resolveSwapAddress(params: ResolveSwapAddressParams<T>): Promise<string>;
  abstract resolveTokenAddress(params: ResolveTokenAddressParams<T>): Promise<string>;
  abstract resolveGaugeAddresses(params: ResolveGaugeAddressParams<T>): Promise<string[]>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CurveGauge {
    return this.contractFactory.curveGauge({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CurvePoolGaugeDefinition[]> {
    const registry = this.resolveRegistry(this.registryAddress);
    const registryContract = multicall.wrap(registry);

    const poolCount = await this.resolvePoolCount({ registryContract, multicall });
    const poolRange = range(0, Number(poolCount));
    const poolDefinitions = await Promise.all(
      poolRange.map(async poolIndex => {
        const swapAddress = await this.resolveSwapAddress({ registryContract, poolIndex, multicall });
        const tokenAddress = await this.resolveTokenAddress({ registryContract, swapAddress, multicall });
        const gaugeAddresses = await this.resolveGaugeAddresses({ registryContract, swapAddress, multicall });
        const realGaugeAddresses = gaugeAddresses.filter(v => v !== ZERO_ADDRESS);

        return await Promise.all(
          realGaugeAddresses.map(async gaugeAddress => ({
            address: gaugeAddress.toLowerCase(),
            swapAddress: swapAddress.toLowerCase(),
            tokenAddress: tokenAddress.toLowerCase(),
            gaugeType: await this.resolveGaugeType(gaugeAddress),
          })),
        );
      }),
    );

    return poolDefinitions.flat();
  }

  private async resolveGaugeType(gaugeAddress: string) {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    let bytecode = await provider.getCode(gaugeAddress);
    const minimalProxyMatch = /0x363d3d373d3d3d363d73(.*)5af43d82803e903d91602b57fd5bf3/.exec(bytecode);
    if (minimalProxyMatch) bytecode = await provider.getCode(`0x${minimalProxyMatch[1]}`);

    const doubleGaugeMethod = ethers.utils.id('rewarded_token()').slice(2, 10);
    const nGaugeMethod = ethers.utils.id('reward_tokens(uint256)').slice(2, 10);
    const childGaugeMethod = ethers.utils.id('reward_data(address)').slice(2, 10);
    const gaugeV4Method = ethers.utils.id('claimable_reward_write(address,address)').slice(2, 10);

    if (this.network === Network.ETHEREUM_MAINNET) {
      if (bytecode.includes(gaugeV4Method)) return GaugeType.GAUGE_V4;
      if (bytecode.includes(nGaugeMethod)) return GaugeType.N_GAUGE;
      if (bytecode.includes(doubleGaugeMethod)) return GaugeType.DOUBLE;
      return GaugeType.SINGLE;
    } else {
      if (bytecode.includes(childGaugeMethod)) return GaugeType.CHILD;
      return GaugeType.REWARDS_ONLY;
    }
  }

  async getTokenDefinitions({
    address,
    definition,
    multicall,
  }: GetTokenDefinitionsParams<CurveGauge, CurvePoolGaugeDefinition>) {
    const definitions = [{ metaType: MetaType.SUPPLIED, address: definition.tokenAddress, network: this.network }];

    // All gauges except the legacy sidechain/L2 "rewards-only" gauges support CRV rewards
    const crvRewardToken = { metaType: MetaType.CLAIMABLE, address: this.crvTokenAddress, network: this.network };
    if (definition.gaugeType !== GaugeType.REWARDS_ONLY) definitions.push(crvRewardToken);

    // Legacy "double" gauge supports one extra reward token
    if (definition.gaugeType === GaugeType.DOUBLE) {
      const doubleGauge = this.contractFactory.curveDoubleGauge({ address, network: this.network });
      const rewardTokenAddress = await multicall.wrap(doubleGauge).rewarded_token();
      definitions.push({ metaType: MetaType.CLAIMABLE, address: rewardTokenAddress, network: this.network });
    }

    // Modern "n" gauges supports multiple extra tokens
    const nRewardsGauges = [GaugeType.CHILD, GaugeType.GAUGE_V4, GaugeType.N_GAUGE, GaugeType.REWARDS_ONLY];
    if (nRewardsGauges.includes(definition.gaugeType)) {
      const nGauge = this.contractFactory.curveNGauge({ address, network: this.network });
      const rewardTokenAddresses = await Promise.all(range(0, 4).map(i => multicall.wrap(nGauge).reward_tokens(i)));
      const filtered = rewardTokenAddresses.filter(v => v !== ZERO_ADDRESS);
      filtered.forEach(v => definitions.push({ metaType: MetaType.CLAIMABLE, address: v, network: this.network }));
    }

    return definitions;
  }

  async getDataProps({
    address,
    contract,
    multicall,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    CurveGauge,
    CurvePoolGaugeDataProps,
    CurvePoolGaugeDefinition
  >): Promise<CurvePoolGaugeDataProps> {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    // Derive liquidity as the amount of the staked token held by the gauge contract
    const stakedTokenContract = this.contractFactory.erc20(stakedToken);
    const reserveRaw = await multicall.wrap(stakedTokenContract).balanceOf(address);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    const liquidity = reserve * stakedToken.price;
    const gaugeType = definition.gaugeType;

    // On the Ethereum network, derive the APY from the inflation rate and relative weight
    const ethGauges = [GaugeType.SINGLE, GaugeType.DOUBLE, GaugeType.N_GAUGE, GaugeType.GAUGE_V4];
    if (ethGauges.includes(gaugeType)) {
      const controller = this.contractFactory.curveController({
        address: this.controllerAddress!,
        network: this.network,
      });

      const inflationRateRaw = await contract.inflation_rate();
      const workingSupplyRaw = await contract.working_supply();
      const relativeWeightRaw = await multicall.wrap(controller)['gauge_relative_weight(address)'](address);

      const inflationRate = Number(inflationRateRaw) / 10 ** 18;
      const workingSupply = Number(workingSupplyRaw) / 10 ** 18;
      const relativeWeight = Number(relativeWeightRaw) / 10 ** 18;

      const secondsPerYear = moment.duration(1, 'year').asSeconds();
      const ratePerSecond = (inflationRate * relativeWeight * 0.4) / workingSupply;
      const apy = ((ratePerSecond * secondsPerYear) / stakedToken.price) * rewardTokens[0].price * 100;
      const isActive = Number(inflationRate) > 0;

      return { gaugeType, liquidity, apy, isActive };
    }

    if (gaugeType === GaugeType.CHILD) {
      // Calculate annual CRV rewards
      const gaugeContract = this.contractFactory.curveChildLiquidityGauge({ address, network: this.network });
      const period = await multicall.wrap(gaugeContract).period();
      const periodTimestamp = await multicall.wrap(gaugeContract).period_timestamp(period);
      const periodWeek = Math.floor(periodTimestamp.toNumber() / moment.duration(7, 'days').asSeconds()); // num weeks

      const crvToken = rewardTokens.find(v => v.address === this.crvTokenAddress)!;
      const crvInflationRateRaw = await multicall.wrap(gaugeContract).inflation_rate(periodWeek);
      const crvInflationRate = Number(crvInflationRateRaw) / 10 ** crvToken.decimals;
      const crvYearlyReward = crvInflationRate * moment.duration(1, 'year').asSeconds();
      const crvYearlyRewardInUSD = crvYearlyReward * crvToken.price;

      // Calculate annual bonus rewards
      const rewardTokenCount = await multicall.wrap(gaugeContract).reward_count();
      const individualRewardsInUSD = await Promise.all(
        range(0, Number(rewardTokenCount)).map(async index => {
          const rewardTokenAddressRaw = await multicall.wrap(gaugeContract).reward_tokens(index);
          const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
          const rewardToken = rewardTokens.find(p => p.address === rewardTokenAddress);
          if (!rewardToken) return 0;

          const rewardData = await multicall.wrap(gaugeContract).reward_data(rewardTokenAddress);
          if (Number(rewardData.period_finish) < Date.now() / 1000) return 0;

          return new BigNumber(rewardData.rate.toString())
            .times(365 * 24 * 60 * 60)
            .times(rewardToken.price)
            .dividedBy(10 ** rewardToken.decimals)
            .toNumber();
        }),
      );

      const apy = liquidity > 0 ? (sum(individualRewardsInUSD) + crvYearlyRewardInUSD) / liquidity : 0;
      const isActive = crvInflationRate > 0;
      return { gaugeType, liquidity, apy, isActive };
    }

    return { gaugeType, liquidity, apy: 0, isActive: false };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<CurveGauge, CurvePoolGaugeDataProps, CurvePoolGaugeDefinition>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<CurveGauge, CurvePoolGaugeDataProps>): Promise<BigNumberish[]> {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const balances = [await contract.balanceOf(address)];

    // For the gauges that have claimable CRV, query it
    const hasCrv = [GaugeType.SINGLE, GaugeType.DOUBLE, GaugeType.N_GAUGE, GaugeType.CHILD];
    if (hasCrv.includes(contractPosition.dataProps.gaugeType)) balances.push(await contract.claimable_tokens(address));

    // Legacy "double" gauge supports one extra reward token
    if (contractPosition.dataProps.gaugeType === GaugeType.DOUBLE && rewardTokens.length > 1) {
      const doubleGauge = this.contractFactory.curveDoubleGauge({ address, network: this.network });
      const [secondaryRewardBalanceTotal, secondaryRewardBalanceClaimed] = await Promise.all([
        multicall.wrap(doubleGauge).claimable_reward(address),
        multicall.wrap(doubleGauge).claimed_rewards_for(address),
      ]);

      const secondaryRewardBalance = secondaryRewardBalanceTotal.sub(secondaryRewardBalanceClaimed);
      balances.push(secondaryRewardBalance);
    }

    // Modern "n" gauges supports multiple extra tokens. Call the read function for "n" gauge and "child liquidity" gauges
    const readNRewardsGauges = [GaugeType.N_GAUGE, GaugeType.CHILD];
    if (readNRewardsGauges.includes(contractPosition.dataProps.gaugeType)) {
      const nGauge = this.contractFactory.curveNGauge({ address, network: this.network });
      const [, ...otherRewardTokens] = rewardTokens;
      const rewardTokenBalances = await Promise.all(
        otherRewardTokens.map(t => multicall.wrap(nGauge).claimable_reward(address, t.address)),
      );

      balances.push(...rewardTokenBalances);
    }

    // Modern "n" gauges supports multiple extra tokens. Call the read function for "v4" gauge and "rewards only" gauges
    const writeNRewardsGauges = [GaugeType.GAUGE_V4, GaugeType.REWARDS_ONLY];
    if (writeNRewardsGauges.includes(contractPosition.dataProps.gaugeType)) {
      const nGauge = this.contractFactory.curveGaugeV2({ address, network: this.network });

      const queriedTokens =
        contractPosition.dataProps.gaugeType === GaugeType.GAUGE_V4 ? rewardTokens.slice(1) : rewardTokens;
      const rewardTokenBalances = await Promise.all(
        queriedTokens.map(t => multicall.wrap(nGauge).claimable_reward_write(address, t.address)),
      );

      balances.push(...rewardTokenBalances);
    }

    return balances;
  }
}
