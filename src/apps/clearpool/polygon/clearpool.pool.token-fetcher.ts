import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsStageParams,
  GetDisplayPropsStageParams,
  GetPricePerShareStageParams,
  GetUnderlyingTokensStageParams,
} from '~position/template/app-token.template.types';
import { Network, NETWORK_IDS } from '~types';

import { CLEARPOOL_DEFINITION } from '../clearpool.definition';
import { ClearpoolContractFactory, ClearpoolPool } from '../contracts';

const appId = CLEARPOOL_DEFINITION.id;
const groupId = CLEARPOOL_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

export type ClearpoolPoolTokenDataProps = {
  liquidity: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonClearpoolPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  ClearpoolPool,
  ClearpoolPoolTokenDataProps
> {
  appId = CLEARPOOL_DEFINITION.id;
  groupId = CLEARPOOL_DEFINITION.groups.pool.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected appToolkit: IAppToolkit,
    @Inject(ClearpoolContractFactory) protected clearpoolContractFactory: ClearpoolContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const endpoint = `https://api-v3.clearpool.finance/${NETWORK_IDS[network]}/pools`;
    const data = await Axios.get(endpoint).then(v => v.data);
    return data.map(({ address }) => address.toLowerCase());
  }

  getContract(address: string): ClearpoolPool {
    return this.clearpoolContractFactory.clearpoolPool({ address, network });
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensStageParams<ClearpoolPool>) {
    return contract.currency();
  }

  getPricePerShare({
    contract,
  }: GetPricePerShareStageParams<ClearpoolPool, ClearpoolPoolTokenDataProps>): Promise<number | number[]> {
    return contract.getCurrentExchangeRate().then(v => Number(v) / 10 ** 18);
  }

  async getDataProps({ contract }: GetDataPropsStageParams<ClearpoolPool, ClearpoolPoolTokenDataProps>) {
    const poolSizeRaw = await contract.poolSize();
    const liquidity = Number(poolSizeRaw) / 10 ** 6;
    return { liquidity };
  }

  getLabel({ contract }: GetDisplayPropsStageParams<ClearpoolPool, ClearpoolPoolTokenDataProps>) {
    return contract.name();
  }
}
