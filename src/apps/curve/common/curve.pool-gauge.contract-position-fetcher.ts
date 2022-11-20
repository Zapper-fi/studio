import { Inject } from '@nestjs/common';
import { BigNumberish, Contract, ethers } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveGauge } from '../contracts';

export enum CurveGaugeType {
  SINGLE = 'single',
  DOUBLE = 'double',
  N_GAUGE = 'n-gauge',
  GAUGE_V4 = 'gauge-v4',
  CHILD = 'child-chain',
  REWARDS_ONLY = 'rewards-only',
}

export type CurvePoolTokenDataProps = {
  swapAddress: string;
  liquidity: number;
  reserves: number[];
  apy: number;
  volume: number;
  fee: number;
};

export type CurvePoolGaugeDefinition = {
  address: string;
  swapAddress: string;
  tokenAddress: string;
  gaugeType: CurveGaugeType;
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
> extends ContractPositionTemplatePositionFetcher<CurveGauge, CurvePoolTokenDataProps, CurvePoolGaugeDefinition> {
  abstract registryAddress: string;
  abstract crvTokenAddress: string;

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
      if (bytecode.includes(gaugeV4Method)) return CurveGaugeType.GAUGE_V4;
      if (bytecode.includes(nGaugeMethod)) return CurveGaugeType.N_GAUGE;
      if (bytecode.includes(doubleGaugeMethod)) return CurveGaugeType.DOUBLE;
      return CurveGaugeType.SINGLE;
    } else {
      if (bytecode.includes(childGaugeMethod)) return CurveGaugeType.CHILD;
      return CurveGaugeType.REWARDS_ONLY;
    }
  }

  async getTokenDefinitions({
    definition,
    multicall,
  }: GetTokenDefinitionsParams<CurveGauge, CurvePoolGaugeDefinition>) {
    const definitions = [{ metaType: MetaType.SUPPLIED, address: definition.tokenAddress, network: this.network }];

    switch (definition.gaugeType) {
      case CurveGaugeType.SINGLE: {
        definitions.push({ metaType: MetaType.CLAIMABLE, address: this.crvTokenAddress, network: this.network });
        break;
      }

      case CurveGaugeType.DOUBLE: {
        const doubleContract = this.contractFactory.curveDoubleGauge({
          address: definition.address,
          network: this.network,
        });

        const extraRewardTokenAddress = await multicall.wrap(doubleContract).rewarded_token();
        definitions.push({ metaType: MetaType.CLAIMABLE, address: this.crvTokenAddress, network: this.network });
        if (extraRewardTokenAddress !== ZERO_ADDRESS)
          definitions.push({ metaType: MetaType.CLAIMABLE, address: extraRewardTokenAddress, network: this.network });

        break;
      }

      case CurveGaugeType.N_GAUGE:
      case CurveGaugeType.GAUGE_V4: {
        const nGaugeContract = this.contractFactory.curveNGauge({
          address: definition.address,
          network: this.network,
        });

        const extraRewardTokenAddress = await multicall.wrap(nGaugeContract).reward_tokens(0);
        definitions.push({ metaType: MetaType.CLAIMABLE, address: this.crvTokenAddress, network: this.network });
        if (extraRewardTokenAddress !== ZERO_ADDRESS)
          definitions.push({ metaType: MetaType.CLAIMABLE, address: extraRewardTokenAddress, network: this.network });

        break;
      }

      default:
        break;
    }

    return definitions;
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<CurveGauge, CurvePoolTokenDataProps, CurvePoolGaugeDefinition>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition() {
    return [];
  }
}
