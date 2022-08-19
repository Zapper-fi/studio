import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { OpenleverageContractFactory, OpenleverageLpool } from '../contracts';
import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';

const appId = OPENLEVERAGE_DEFINITION.id;
const groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;
const poolDetailMap = {};

type OpenLeveragePoolsResponse = {
  pools: {
    id: string;
  }[];
};

type OpenLeverageDataProps = {
  apy: number;
  liquidity: number;
};

const query = gql`
  query fetchPools {
    pools(first: 1000) {
      id
      marketId
    	token0 {
    	  id
    	}
    	token1 {
    	  id
    	}
    }
  }
`;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainOpenleveragePoolTokenFetcher extends AppTokenTemplatePositionFetcher<OpenleverageLpool, OpenLeverageDataProps> {
  appId = OPENLEVERAGE_DEFINITION.id;
  groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OpenleverageContractFactory) protected readonly contractFactory: OpenleverageContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const endpoint = `https://api.thegraph.com/subgraphs/name/openleveragedev/openleverage-bsc`;
    const data = await this.appToolkit.helpers.theGraphHelper.request<OpenLeveragePoolsResponse>({ endpoint, query });
    return data.pools.map(v => v.id);
  }

  getContract(address: string) {
    return this.contractFactory.openleverageLpool({ address, network });
  }

  getUnderlyingTokenAddresses({ contract }: UnderlyingTokensStageParams<OpenleverageLpool>) {
    return contract.underlying();
  }

  async getPricePerShare({ contract }: PricePerShareStageParams<OpenleverageLpool>) {
    const exchangeRateCurrent = await contract.exchangeRateStored();
    return Number(exchangeRateCurrent) / 10 ** 18;
  }

  async getDataProps({ appToken }: DataPropsStageParams<OpenleverageLpool, OpenLeverageDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    if (Object.keys(poolDetailMap).length == 0) {
      const endpoint = `https://bnb.openleverage.finance/api/info/pool/apy`;
      const { data } = await Axios.get(endpoint);
      data?.forEach(pool => {
        poolDetailMap[pool.poolAddr] = {
          lendingYieldY: pool.lendingYieldY,
          token1Symbol: pool.token1Symbol
        };
      });
    }
    const apy = poolDetailMap[appToken.address].lendingYieldY || 0;
    return { liquidity, apy };
  }

  async getLabel({ appToken }: DisplayPropsStageParams<OpenleverageLpool>) {
    return getLabelFromToken(appToken.tokens[0]) + "/" + poolDetailMap[appToken.address].token1Symbol;
  }
}
