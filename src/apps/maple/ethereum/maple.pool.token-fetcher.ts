import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { MaplePoolDefinitionResolver } from '../common/maple.pool.definition-resolver';
import { MapleContractFactory, MaplePool } from '../contracts';

export type MaplePoolTokenDefinition = {
  address: string;
  poolName: string;
  apy: number;
};

@PositionTemplate()
export class EthereumMaplePoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  MaplePool,
  DefaultAppTokenDataProps,
  MaplePoolTokenDefinition
> {
  groupLabel = 'Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MapleContractFactory) protected readonly contractFactory: MapleContractFactory,
    @Inject(MaplePoolDefinitionResolver) protected readonly maplePoolDefinitionResolver: MaplePoolDefinitionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MaplePool {
    return this.contractFactory.maplePool({ network: this.network, address });
  }

  async getDefinitions(): Promise<MaplePoolTokenDefinition[]> {
    return this.maplePoolDefinitionResolver.getPoolDefinitions();
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MaplePool>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getApy({ definition }: GetDataPropsParams<MaplePool, DefaultAppTokenDataProps, MaplePoolTokenDefinition>) {
    return Number(definition.apy) / 10 ** 28;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<MaplePool, DefaultAppTokenDataProps, MaplePoolTokenDefinition>): Promise<string> {
    return definition.poolName;
  }
}
