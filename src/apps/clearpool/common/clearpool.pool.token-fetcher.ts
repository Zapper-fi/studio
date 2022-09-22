import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { NETWORK_IDS } from '~types';

import { ClearpoolContractFactory, ClearpoolPool } from '../contracts';

export abstract class ClearpoolPoolTokenFetcher extends AppTokenTemplatePositionFetcher<ClearpoolPool> {
  constructor(
    @Inject(APP_TOOLKIT) protected appToolkit: IAppToolkit,
    @Inject(ClearpoolContractFactory) protected clearpoolContractFactory: ClearpoolContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const endpoint = `https://api-v3.clearpool.finance/${NETWORK_IDS[this.network]}/pools`;
    const data = await Axios.get(endpoint).then(v => v.data);
    return data.map(({ address }) => address.toLowerCase());
  }

  getContract(address: string): ClearpoolPool {
    return this.clearpoolContractFactory.clearpoolPool({ address, network: this.network });
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<ClearpoolPool>) {
    return contract.currency();
  }

  getPricePerShare({ contract }: GetPricePerShareParams<ClearpoolPool>): Promise<number | number[]> {
    return contract.getCurrentExchangeRate().then(v => Number(v) / 10 ** 18);
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

  async getApy(_params: GetDataPropsParams<ClearpoolPool>) {
    return 0;
  }

  getLabel({ contract }: GetDisplayPropsParams<ClearpoolPool>) {
    return contract.name();
  }
}
