import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { OpenleverageContractFactory, OpenleverageLpool } from '../contracts';
import { OpenleveragePoolAPYHelper } from '../helpers/openleverage-pool.apy-helper';
import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';

const appId = OPENLEVERAGE_DEFINITION.id;
const groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

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
    }
  }
`;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainOpenleveragePoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  OpenleverageLpool,
  OpenLeverageDataProps
> {
  appId = OPENLEVERAGE_DEFINITION.id;
  groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OpenleveragePoolAPYHelper)
    private readonly openleveragePoolAPYHelper: OpenleveragePoolAPYHelper,
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

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<OpenleverageLpool>) {
    return contract.underlying();
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<OpenleverageLpool>) {
    const exchangeRateCurrent = await contract.exchangeRateStored();
    return Number(exchangeRateCurrent) / 10 ** 18;
  }

  async getDataProps({ appToken }: GetDataPropsParams<OpenleverageLpool, OpenLeverageDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    const poolDetailMap = await this.openleveragePoolAPYHelper.getApy();
    const apy = poolDetailMap[appToken.address]?.lendingYieldY || 0;
    return { liquidity, apy };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<OpenleverageLpool>) {
    const poolDetailMap = await this.openleveragePoolAPYHelper.getApy();
    return getLabelFromToken(appToken.tokens[0]) + '/' + poolDetailMap[appToken.address]?.token1Symbol;
  }
}
