import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppToolkit } from '~app-toolkit/app-toolkit.service';
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

import { WolfGameContractFactory, WolfGameWoolPouch } from '../contracts';

export class WolfGameWoolPouchContractPositionFetcher extends ContractPositionTemplatePositionFetcher<WolfGameWoolPouch> {
  groupLabel: string;
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolKit: AppToolkit,
    @Inject(WolfGameContractFactory) protected readonly contractFactory: WolfGameContractFactory,
  ) {
    super(appToolKit);
  }
  getDefinitions(params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xb76fbbb30e31f2c3bdaa2466cfb1cfe39b220d06' }];
  }
  getContract(address: string): WolfGameWoolPouch {
    return this.contractFactory.wolfGameWoolPouch({ address, network: this.network });
  }
  getTokenDefinitions(
    _params: GetTokenDefinitionsParams<WolfGameWoolPouch, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x8355dbe8b0e275abad27eb843f3eaf3fc855e525' }];
  }
  getLabel(
    params: GetDisplayPropsParams<WolfGameWoolPouch, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return 'Wool Pouch';
  }
  getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<WolfGameWoolPouch, DefaultDataProps>): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }
}
