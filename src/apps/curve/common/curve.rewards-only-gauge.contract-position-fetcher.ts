import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { CurveViemContractFactory } from '../contracts';
import { CurveRewardsOnlyGauge } from '../contracts/viem';

import { GaugeType } from './curve.pool-gauge.contract-position-fetcher';

export type CurveRewardsOnlyGaugeDataProps = {
  liquidity: number;
  apy: number;
  isActive: boolean;
  gaugeType: GaugeType.REWARDS_ONLY;
};

export type CurveRewardsOnlyDefinition = {
  address: string;
  gaugeType: GaugeType.REWARDS_ONLY;
};

export abstract class CurveRewardsOnlyGaugeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  CurveRewardsOnlyGauge,
  CurveRewardsOnlyGaugeDataProps,
  CurveRewardsOnlyDefinition
> {
  abstract gaugeAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.curveRewardsOnlyGauge({ address, network: this.network });
  }

  async getDefinitions() {
    return this.gaugeAddresses.map(gaugeAddress => ({
      address: gaugeAddress.toLowerCase(),
      gaugeType: GaugeType.REWARDS_ONLY as const,
    }));
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<CurveRewardsOnlyGauge, CurveRewardsOnlyDefinition>) {
    const definitions = [
      { metaType: MetaType.SUPPLIED, address: await contract.read.lp_token(), network: this.network },
    ];

    const rewardTokenAddresses = await Promise.all(range(0, 4).map(i => contract.read.reward_tokens([BigInt(i)])));
    const filtered = rewardTokenAddresses.filter(v => v !== ZERO_ADDRESS);
    filtered.forEach(v => definitions.push({ metaType: MetaType.CLAIMABLE, address: v, network: this.network }));

    return definitions;
  }

  async getDataProps({
    address,
    multicall,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    CurveRewardsOnlyGauge,
    CurveRewardsOnlyGaugeDataProps,
    CurveRewardsOnlyDefinition
  >): Promise<CurveRewardsOnlyGaugeDataProps> {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;

    // Derive liquidity as the amount of the staked token held by the gauge contract
    const stakedTokenContract = this.appToolkit.globalViemContracts.erc20(stakedToken);
    const reserveRaw = await multicall.wrap(stakedTokenContract).read.balanceOf([address]);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    const liquidity = reserve * stakedToken.price;
    const gaugeType = definition.gaugeType;

    // Legacy; maintained just for balances
    return { gaugeType, liquidity, apy: 0, isActive: false };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<CurveRewardsOnlyGauge, CurveRewardsOnlyGaugeDataProps, CurveRewardsOnlyDefinition>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<CurveRewardsOnlyGauge, CurveRewardsOnlyGaugeDataProps>): Promise<BigNumberish[]> {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    const balances = [
      await contract.read.balanceOf([address]),
      ...(await Promise.all(rewardTokens.map(t => contract.read.claimable_reward_write([address, t.address])))),
    ];

    return balances;
  }
}
