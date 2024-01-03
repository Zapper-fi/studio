import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { range } from 'lodash';
import { duration } from 'moment';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ViemMulticallDataLoader } from '~multicall';
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

import { CurveViemContractFactory } from '../contracts';
import { CurveGauge } from '../contracts/viem';

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

export type ResolvePoolCountParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  multicall: ViemMulticallDataLoader;
};

export type ResolveSwapAddressParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  poolIndex: number;
  multicall: ViemMulticallDataLoader;
};

export type ResolveTokenAddressParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  swapAddress: string;
  multicall: ViemMulticallDataLoader;
};

export type ResolveGaugeAddressParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  swapAddress: string;
  multicall: ViemMulticallDataLoader;
};

export abstract class CurvePoolGaugeContractPositionFetcher<
  T extends Abi,
> extends ContractPositionTemplatePositionFetcher<CurveGauge, CurvePoolGaugeDataProps, CurvePoolGaugeDefinition> {
  abstract registryAddress: string;
  abstract crvTokenAddress: string;
  abstract controllerAddress: string;

  abstract resolveRegistry(address: string): GetContractReturnType<T, PublicClient>;
  abstract resolvePoolCount(params: ResolvePoolCountParams<T>): Promise<BigNumberish>;
  abstract resolveSwapAddress(params: ResolveSwapAddressParams<T>): Promise<string>;
  abstract resolveTokenAddress(params: ResolveTokenAddressParams<T>): Promise<string>;
  abstract resolveGaugeAddresses(params: ResolveGaugeAddressParams<T>): Promise<string[]>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.curveGauge({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CurvePoolGaugeDefinition[]> {
    const contract = multicall.wrap(this.resolveRegistry(this.registryAddress));

    const poolCount = await this.resolvePoolCount({ contract, multicall });
    const poolRange = range(0, Number(poolCount));
    const gaugeDefinitions = await Promise.all(
      poolRange.map(async poolIndex => {
        const swapAddress = await this.resolveSwapAddress({ contract, poolIndex, multicall });
        const tokenAddress = await this.resolveTokenAddress({ contract, swapAddress, multicall });
        const gaugeAddresses = await this.resolveGaugeAddresses({ contract, swapAddress, multicall });
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

    return gaugeDefinitions.flat();
  }

  private async resolveGaugeType(gaugeAddress: string) {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    let bytecode = await provider.getCode(gaugeAddress);
    const minimalProxyMatch = /0x363d3d373d3d3d363d73(.*)5af43d82803e903d91602b57fd5bf3/.exec(bytecode);
    if (minimalProxyMatch) bytecode = await provider.getCode(`0x${minimalProxyMatch[1]}`);

    const doubleGaugeMethod = ethers.utils.id('rewarded_token()').slice(2, 10);
    const nGaugeMethod = ethers.utils.id('reward_tokens(uint256)').slice(2, 10);
    const gaugeV4Method = ethers.utils.id('claimable_reward_write(address,address)').slice(2, 10);

    if (bytecode.includes(gaugeV4Method)) return GaugeType.GAUGE_V4;
    if (bytecode.includes(nGaugeMethod)) return GaugeType.N_GAUGE;
    if (bytecode.includes(doubleGaugeMethod)) return GaugeType.DOUBLE;
    return GaugeType.SINGLE;
  }

  async getTokenDefinitions({
    address,
    definition,
    multicall,
  }: GetTokenDefinitionsParams<CurveGauge, CurvePoolGaugeDefinition>) {
    const definitions = [
      { metaType: MetaType.SUPPLIED, address: definition.tokenAddress, network: this.network },
      { metaType: MetaType.CLAIMABLE, address: this.crvTokenAddress, network: this.network },
    ];

    // Legacy "double" gauge supports one extra reward token
    if (definition.gaugeType === GaugeType.DOUBLE) {
      const doubleGauge = this.contractFactory.curveDoubleGauge({ address, network: this.network });
      const rewardTokenAddress = await multicall.wrap(doubleGauge).read.rewarded_token();
      definitions.push({ metaType: MetaType.CLAIMABLE, address: rewardTokenAddress, network: this.network });
    }

    // Modern "n" gauges supports multiple extra tokens
    if ([GaugeType.GAUGE_V4, GaugeType.N_GAUGE].includes(definition.gaugeType)) {
      const nGauge = this.contractFactory.curveNGauge({ address, network: this.network });
      const rewardTokenAddresses = await Promise.all(
        range(0, 4).map(i => multicall.wrap(nGauge).read.reward_tokens([BigInt(i)])),
      );
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
    const stakedTokenContract = this.appToolkit.globalViemContracts.erc20(stakedToken);
    const reserveRaw = await multicall.wrap(stakedTokenContract).read.balanceOf([address]);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    const liquidity = reserve * stakedToken.price;
    const gaugeType = definition.gaugeType;

    // Derive the APY from the inflation rate and relative weight
    const controller = this.contractFactory.curveController({
      address: this.controllerAddress!,
      network: this.network,
    });

    const inflationRateRaw = await contract.read.inflation_rate();
    const workingSupplyRaw = await contract.read.working_supply();
    const relativeWeightRaw = await multicall.wrap(controller).read.gauge_relative_weight([address]);

    const inflationRate = Number(inflationRateRaw) / 10 ** 18;
    const workingSupply = Number(workingSupplyRaw) / 10 ** 18;
    const relativeWeight = Number(relativeWeightRaw) / 10 ** 18;

    const secondsPerYear = duration(1, 'year').asSeconds();
    const ratePerSecond = (inflationRate * relativeWeight * 0.4) / workingSupply;
    const apy = ((ratePerSecond * secondsPerYear) / stakedToken.price) * rewardTokens[0].price * 100;
    const isActive = Number(inflationRate) > 0;

    return { gaugeType, liquidity, apy, isActive };
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
    const balances = [await contract.read.balanceOf([address]), await contract.read.claimable_tokens([address])];

    // Legacy "double" gauge supports one extra reward token
    if (contractPosition.dataProps.gaugeType === GaugeType.DOUBLE && rewardTokens.length > 1) {
      const doubleGauge = this.contractFactory.curveDoubleGauge(contractPosition);
      const [secondaryRewardBalanceTotal, secondaryRewardBalanceClaimed] = await Promise.all([
        multicall.wrap(doubleGauge).read.claimable_reward([address]),
        multicall.wrap(doubleGauge).read.claimed_rewards_for([address]),
      ]);

      const secondaryRewardBalance = BigNumber.from(secondaryRewardBalanceTotal)
        .sub(secondaryRewardBalanceClaimed)
        .toString();
      balances.push(BigInt(secondaryRewardBalance));
    }

    // Modern "n" gauges supports multiple extra tokens. Call the read function for "n" gauge
    if (contractPosition.dataProps.gaugeType === GaugeType.N_GAUGE) {
      const nGauge = this.contractFactory.curveNGauge(contractPosition);
      const rewardTokenBalances = await Promise.all(
        rewardTokens.slice(1).map(t => multicall.wrap(nGauge).read.claimable_reward([address, t.address])),
      );
      balances.push(...rewardTokenBalances);
    }

    // Modern "n" gauges supports multiple extra tokens. Call the read function for "v4" gauge
    if (contractPosition.dataProps.gaugeType === GaugeType.GAUGE_V4) {
      const nGauge = this.contractFactory.curveGaugeV2(contractPosition);
      const rewardTokenBalances = await Promise.all(
        rewardTokens.slice(1).map(t => multicall.wrap(nGauge).read.claimable_reward_write([address, t.address])),
      );
      balances.push(...rewardTokenBalances);
    }

    return balances;
  }
}
