import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { DolomiteContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumDolomiteBalancesContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) protected readonly dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): Contract {
    throw new Error('Method not implemented.');
  }

  getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    throw new Error('Method not implemented.');
  }

  getTokenDefinitions(
    _params: GetTokenDefinitionsParams<Contract, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    throw new Error('Method not implemented.');
  }

  getLabel(
    _params: GetDisplayPropsParams<Contract, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getTokenBalancesPerPosition(_params: GetTokenBalancesParams<Contract, DefaultDataProps>): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }
}
