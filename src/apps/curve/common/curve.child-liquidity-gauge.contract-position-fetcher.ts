// 0xabc000d88f23bb45525e447528dbf656

import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { range, sum } from 'lodash';
import { duration } from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
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
import { CurveChildLiquidityGauge } from '../contracts/viem';

import { GaugeType } from './curve.pool-gauge.contract-position-fetcher';

export type CurveChildLiquidityGaugeDataProps = {
  liquidity: number;
  apy: number;
  isActive: boolean;
  gaugeType: GaugeType.CHILD;
};

export type CurveChildLiquidityGaugeDefinition = {
  address: string;
  gaugeType: GaugeType.CHILD;
};

export abstract class CurveChildLiquidityGaugeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  CurveChildLiquidityGauge,
  CurveChildLiquidityGaugeDataProps,
  CurveChildLiquidityGaugeDefinition
> {
  abstract factoryAddress: string;
  abstract crvTokenAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.curveChildLiquidityGauge({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CurveChildLiquidityGaugeDefinition[]> {
    const factory = this.contractFactory.curveChildLiquidityGaugeFactory({
      address: this.factoryAddress,
      network: this.network,
    });

    const gaugeCount = await multicall.wrap(factory).read.get_gauge_count();
    const gaugeRange = range(0, Number(gaugeCount));
    const gaugeDefinitions = await Promise.all(
      gaugeRange.map(async index => {
        const gaugeAddress = await multicall.wrap(factory).read.get_gauge([BigInt(index)]);
        return { address: gaugeAddress.toLowerCase(), gaugeType: GaugeType.CHILD as const };
      }),
    );

    return gaugeDefinitions.flat();
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<CurveChildLiquidityGauge>) {
    const lpTokenAddress = await contract.read.lp_token();
    const definitions = [{ metaType: MetaType.SUPPLIED, address: lpTokenAddress, network: this.network }];
    definitions.push({ metaType: MetaType.CLAIMABLE, address: this.crvTokenAddress, network: this.network });

    const rewardTokenAddresses = await Promise.all(range(0, 4).map(i => contract.read.reward_tokens([BigInt(i)])));
    const filtered = rewardTokenAddresses.filter(v => v !== ZERO_ADDRESS);
    filtered.forEach(v => definitions.push({ metaType: MetaType.CLAIMABLE, address: v, network: this.network }));

    return definitions;
  }

  async getDataProps({
    address,
    contract,
    multicall,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    CurveChildLiquidityGauge,
    CurveChildLiquidityGaugeDataProps,
    CurveChildLiquidityGaugeDefinition
  >): Promise<CurveChildLiquidityGaugeDataProps> {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    // Derive liquidity as the amount of the staked token held by the gauge contract
    const stakedTokenContract = this.appToolkit.globalViemContracts.erc20(stakedToken);
    const reserveRaw = await multicall.wrap(stakedTokenContract).read.balanceOf([address]);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    const liquidity = reserve * stakedToken.price;
    const gaugeType = definition.gaugeType;

    // Calculate annual CRV rewards
    const period = await contract.read.period();
    const periodTimestamp = await contract.read.period_timestamp([period]);
    const periodWeek = Math.floor(Number(periodTimestamp) / duration(7, 'days').asSeconds()); // num weeks

    const crvToken = rewardTokens.find(v => v.address === this.crvTokenAddress)!;
    const crvInflationRateRaw = await contract.read.inflation_rate([BigInt(periodWeek)]);
    const crvInflationRate = Number(crvInflationRateRaw) / 10 ** crvToken.decimals;
    const crvYearlyReward = crvInflationRate * duration(1, 'year').asSeconds();
    const crvYearlyRewardInUSD = crvYearlyReward * crvToken.price;

    // Calculate annual bonus rewards
    const rewardTokenCount = await contract.read.reward_count();
    const individualRewardsInUSD = await Promise.all(
      range(0, Number(rewardTokenCount)).map(async index => {
        const rewardTokenAddressRaw = await contract.read.reward_tokens([BigInt(index)]);
        const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
        const rewardToken = rewardTokens.find(p => p.address === rewardTokenAddress);
        if (!rewardToken) return 0;

        const rewardData = await contract.read.reward_data([rewardTokenAddress]);
        if (Number(rewardData.period_finish) < Date.now() / 1000) return 0;

        return new BigNumber(rewardData.rate.toString())
          .times(365 * 24 * 60 * 60)
          .times(rewardToken.price)
          .dividedBy(10 ** rewardToken.decimals)
          .toNumber();
      }),
    );

    const apy = liquidity > 0 ? ((sum(individualRewardsInUSD) + crvYearlyRewardInUSD) / liquidity) * 100 : 0;
    const isActive = crvInflationRate > 0;
    return { gaugeType, liquidity, apy, isActive };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<
    CurveChildLiquidityGauge,
    CurveChildLiquidityGaugeDataProps,
    CurveChildLiquidityGaugeDefinition
  >) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<CurveChildLiquidityGauge, CurveChildLiquidityGaugeDataProps>): Promise<BigNumberish[]> {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    const balances = [
      await contract.read.balanceOf([address]),
      await contract.simulate.claimable_tokens([address]).then(v => v.result),
      ...(await Promise.all(rewardTokens.slice(1).map(t => contract.read.claimable_reward([address, t.address])))),
    ];

    return balances;
  }
}
