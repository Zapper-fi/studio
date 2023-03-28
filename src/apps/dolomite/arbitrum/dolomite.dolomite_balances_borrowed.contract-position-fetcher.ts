import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DOLOMITE_MARGIN_ADDRESSES } from '~apps/dolomite/dolomite.module';
import {
  DolomiteDataProps,
  getTokenBalancesPerPositionLib,
  getTokenDefinitionsLib,
  mapTokensToDolomiteDataProps,
} from '~apps/dolomite/utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { DolomiteContractFactory, DolomiteMargin } from '../contracts';

@PositionTemplate()
export class ArbitrumDolomiteDolomiteBalancesBorrowedContractPositionFetcher extends ContractPositionTemplatePositionFetcher<DolomiteMargin> {
  groupLabel = 'Dolomite Balances - Borrowed';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) protected readonly dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DolomiteMargin {
    return this.dolomiteContractFactory.dolomiteMargin({ address, network: this.network });
  }

  getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return Promise.resolve([
      {
        address: DOLOMITE_MARGIN_ADDRESSES[this.network],
      },
    ]);
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<DolomiteMargin>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return getTokenDefinitionsLib(params, this.dolomiteContractFactory, this.network, false);
  }

  async getDataProps(params: GetDataPropsParams<DolomiteMargin, DolomiteDataProps>): Promise<DolomiteDataProps> {
    return mapTokensToDolomiteDataProps(params, this.dolomiteContractFactory, this.network, false);
  }

  async getLabel(_params: GetDisplayPropsParams<DolomiteMargin>): Promise<string> {
    return this.groupLabel;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<DolomiteMargin, DolomiteDataProps>,
  ): Promise<BigNumberish[]> {
    return getTokenBalancesPerPositionLib(params, this.dolomiteContractFactory, this.network, false);
  }
}
