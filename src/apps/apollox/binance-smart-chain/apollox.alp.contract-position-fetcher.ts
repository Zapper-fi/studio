import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

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
} from '~position/template/contract-position.template.types';

import { Alp, ApolloxContractFactory } from '../contracts';

const ALP_PROXY_CONTRACT = '0x4e47057f45adf24ba41375a175da0357cb3480e5';
@PositionTemplate()
export class BinanceSmartChainApolloxAlpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Alp> {
  groupLabel = 'Liquidity Pool';
  isDebt = false;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ApolloxContractFactory) protected readonly apolloxContractFactory: ApolloxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Alp {
    return this.apolloxContractFactory.alp({ address: address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: ALP_PROXY_CONTRACT }];
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<Alp, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: params.contract.address, network: this.network, metaType: MetaType.SUPPLIED }];
  }

  async getLabel(
    params: GetDisplayPropsParams<Alp, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return `${params.contract.symbol()}`;
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<Alp, DefaultDataProps>): Promise<BigNumberish[]> {
    return [await params.contract.balanceOf(params.address)];
  }
}
