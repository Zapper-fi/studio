import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _, { range } from 'lodash';
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
import { CurveGaugeV6 } from '../contracts/viem/CurveGaugeV6';

export type CurvePoolGaugeDataProps = {
  liquidity: number;
  apy: number;
  isActive: boolean;
};

export type CurvePoolGaugeDefinition = {
  address: string;
  tokenAddress: string;
  extraRewardTokenAddresses: string[];
};

export type ResolvePoolCountParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  multicall: ViemMulticallDataLoader;
};

export type ResolveTokenAddressParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  poolIndex: number;
  multicall: ViemMulticallDataLoader;
};

export type ResolveGaugeAddressParams<T extends Abi> = {
  contract: GetContractReturnType<T, PublicClient>;
  tokenAddress: string;
  multicall: ViemMulticallDataLoader;
};

export abstract class CurvePoolGaugeV6ContractPositionFetcher<
  T extends Abi,
> extends ContractPositionTemplatePositionFetcher<CurveGaugeV6, CurvePoolGaugeDataProps, CurvePoolGaugeDefinition> {
  abstract factoryAddress: string;
  abstract controllerAddress: string;
  abstract crvAddress: string;

  abstract resolveFactory(address: string): GetContractReturnType<T, PublicClient>;
  abstract resolvePoolCount(params: ResolvePoolCountParams<T>): Promise<BigNumberish>;
  abstract resolveTokenAddress(params: ResolveTokenAddressParams<T>): Promise<string>;
  abstract resolveGaugeAddress(params: ResolveGaugeAddressParams<T>): Promise<string>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.curveGaugeV6({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<CurvePoolGaugeDefinition[]> {
    const contract = multicall.wrap(this.resolveFactory(this.factoryAddress));

    const poolCount = await this.resolvePoolCount({ contract, multicall });
    const poolRange = range(0, Number(poolCount));
    const gaugeDefinitions = await Promise.all(
      poolRange.map(async poolIndex => {
        const tokenAddress = await this.resolveTokenAddress({ contract, poolIndex, multicall });
        const gaugeAddress = await this.resolveGaugeAddress({ contract, tokenAddress, multicall });

        if (gaugeAddress == ZERO_ADDRESS) return null;

        const gaugeV6Contract = this.contractFactory.curveGaugeV6({
          address: gaugeAddress.toLowerCase(),
          network: this.network,
        });

        const rewardTokenCount = await multicall.wrap(gaugeV6Contract).read.reward_count();
        const rewardTokenAddressesRaw = await Promise.all(
          _.range(Number(rewardTokenCount)).map(async i => {
            return multicall.wrap(gaugeV6Contract).read.reward_tokens([BigInt(i)]);
          }),
        );

        return {
          address: gaugeAddress.toLowerCase(),
          tokenAddress: tokenAddress.toLowerCase(),
          extraRewardTokenAddresses: rewardTokenAddressesRaw.map(x => x.toLowerCase()),
        };
      }),
    );

    return _.compact(gaugeDefinitions);
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<CurveGaugeV6, CurvePoolGaugeDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.tokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: this.crvAddress,
        network: this.network,
      },
      ...definition.extraRewardTokenAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  async getDataProps({
    address,
    contract,
    multicall,
    contractPosition,
  }: GetDataPropsParams<
    CurveGaugeV6,
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

    // Derive the APY from the inflation rate and relative weight
    const controller = this.contractFactory.curveController({
      address: this.controllerAddress,
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
    const apy =
      rewardTokens.length > 0
        ? ((ratePerSecond * secondsPerYear) / stakedToken.price) * rewardTokens[0].price * 100
        : 0;
    const isActive = Number(inflationRate) > 0;

    return { liquidity, apy, isActive };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<CurveGaugeV6, CurvePoolGaugeDataProps, CurvePoolGaugeDefinition>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<CurveGaugeV6, CurvePoolGaugeDataProps>): Promise<BigNumberish[]> {
    const [supplied, claimable] = await Promise.all([
      contract.read.balanceOf([address]),
      contract.simulate.claimable_tokens([address]).then(v => v.result),
    ]);

    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    const extraRewardBalances = await Promise.all(
      rewardTokens.map(rewardToken => {
        return contract.read.claimable_reward([address, rewardToken.address]);
      }),
    );

    return [supplied, claimable, ...extraRewardBalances];
  }
}
