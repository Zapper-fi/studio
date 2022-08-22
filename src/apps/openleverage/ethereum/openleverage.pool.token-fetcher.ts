import { Inject } from '@nestjs/common';
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
const network = Network.ETHEREUM_MAINNET;

type OpenLeveragePoolsResponse = {
  pools: {
    id: string;
  }[];
};

const query = gql`
  query fetchPools {
    pools(first: 1000) {
      id
    }
  }
`;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumOpenleveragePoolTokenFetcher extends AppTokenTemplatePositionFetcher<OpenleverageLpool> {
  appId = OPENLEVERAGE_DEFINITION.id;
  groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OpenleverageContractFactory) protected readonly contractFactory: OpenleverageContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const endpoint = `https://api.thegraph.com/subgraphs/name/openleveragedev/openleverage`;
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

  async getDataProps({ appToken }: DataPropsStageParams<OpenleverageLpool>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }

  async getLabel({ appToken }: DisplayPropsStageParams<OpenleverageLpool>) {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
