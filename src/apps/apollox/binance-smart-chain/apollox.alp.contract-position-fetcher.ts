import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Alp, ApolloxContractFactory } from '../contracts';

const ALP_CONTRACT = '0x4e47057f45adf24ba41375a175da0357cb3480e5';
const APX_CONTRACT = '0x78f5d389f5cdccfc41594abab4b0ed02f31398b3';

export type AlpSupplyDetails = DefaultContractPositionDefinition & {
  apy?: number;
  TotalAmountStaked?: number;
  TotalRewards?: number;
};

@PositionTemplate()
export class BinanceSmartChainApolloxAlpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ApolloxContractFactory) protected readonly apolloxContractFactory: ApolloxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Contract {
    return this.apolloxContractFactory.alp({ address: address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<AlpSupplyDetails[]> {
    return [{ address: ALP_CONTRACT }];
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<Contract, AlpSupplyDetails>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [
      { address: ALP_CONTRACT, network: this.network, metaType: MetaType.SUPPLIED, tokenId: 0 },
      { address: APX_CONTRACT, network: this.network, metaType: MetaType.CLAIMABLE, tokenId: 1 },
    ];
  }

  async getLabel(_params: GetDisplayPropsParams<Contract, DefaultDataProps, AlpSupplyDetails>): Promise<string> {
    return 'ApolloX Liquidity Pool';
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<Alp, DefaultDataProps>): Promise<BigNumberish[]> {
    return [await params.contract.balanceOf(params.address), await params.contract.circulatingSupply()];
  }
}
