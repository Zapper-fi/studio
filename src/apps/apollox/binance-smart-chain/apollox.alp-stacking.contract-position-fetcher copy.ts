import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { Apx, ApolloxContractFactory, AlpStaking } from '../contracts';

const ALP_PROXY_CONTRACT = '0x4e47057f45adf24ba41375a175da0357cb3480e5';
const ALP_STAKING_PROXY_CONTRACT = '0x1b6f2d3844c6ae7d56ceb3c3643b9060ba28feb0';
const APX_CONTRACT = '0x78f5d389f5cdccfc41594abab4b0ed02f31398b3';

export type AlpStakingDefinition = DefaultContractPositionDefinition & {
  apy?: number;
  totalAmountStaked?: BigNumber;
};

@PositionTemplate()
export class BinanceSmartChainApolloxAlpStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AlpStaking> {
  groupLabel = 'Staked Liquidity Pool';
  isDebt = false;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ApolloxContractFactory) protected readonly apolloxContractFactory: ApolloxContractFactory,
  ) {
    super(appToolkit);
  }

  async getRewardTokenContract(): Promise<Apx> {
    return this.apolloxContractFactory.apx({ address: APX_CONTRACT, network: this.network });
  }

  getContract(address: string): AlpStaking {
    return this.apolloxContractFactory.alpStaking({ address: address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<AlpStakingDefinition[]> {
    return [
      {
        address: ALP_STAKING_PROXY_CONTRACT,
        totalAmountStaked: await this.getContract(ALP_STAKING_PROXY_CONTRACT).totalStaked(),
      },
    ];
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<AlpStaking, AlpStakingDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [
      { address: ALP_PROXY_CONTRACT, network: this.network, metaType: MetaType.SUPPLIED },
      { address: APX_CONTRACT, network: this.network, metaType: MetaType.CLAIMABLE },
    ];
  }

  async getLabel(_params: GetDisplayPropsParams<AlpStaking, DefaultDataProps, AlpStakingDefinition>): Promise<string> {
    return 'Staked ALP';
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<AlpStaking, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    return [await params.contract.stakeOf(params.address)];
  }
}
