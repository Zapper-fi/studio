import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { ClearpoolContractFactory, ClearpoolPool } from '../contracts';

import { ClearpoolPoolDefinitionsResolver } from './clearpool.pool-definition-resolver';

export abstract class ClearpoolPoolTokenFetcher extends AppTokenTemplatePositionFetcher<ClearpoolPool> {
  constructor(
    @Inject(APP_TOOLKIT) protected appToolkit: IAppToolkit,
    @Inject(ClearpoolContractFactory) protected clearpoolContractFactory: ClearpoolContractFactory,
    @Inject(ClearpoolPoolDefinitionsResolver)
    protected poolDefinitionResolver: ClearpoolPoolDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return this.poolDefinitionResolver.getPoolDefinitions(this.network);
  }

  getContract(address: string): ClearpoolPool {
    return this.clearpoolContractFactory.clearpoolPool({ address, network: this.network });
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<ClearpoolPool>) {
    return [{ address: await contract.currency(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<ClearpoolPool>) {
    return contract.getCurrentExchangeRate().then(v => [Number(v) / 10 ** 18]);
  }

  async getLiquidity({ appToken, contract }: GetDataPropsParams<ClearpoolPool>) {
    const poolSizeRaw = await contract.poolSize();
    const reserve = Number(poolSizeRaw) / 10 ** 6;
    return reserve * appToken.tokens[0].price;
  }

  async getReserves({ contract }: GetDataPropsParams<ClearpoolPool>) {
    const poolSizeRaw = await contract.poolSize();
    return [Number(poolSizeRaw) / 10 ** 6];
  }

  getLabel({ contract }: GetDisplayPropsParams<ClearpoolPool>) {
    return contract.name();
  }
}
