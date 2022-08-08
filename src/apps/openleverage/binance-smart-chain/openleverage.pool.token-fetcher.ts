import { Inject } from '@nestjs/common';
<<<<<<< HEAD
import Axios from 'axios';
import BigNumberJS from 'bignumber.js';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
=======
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
} from '~position/template/app-token.template.position-fetcher';
>>>>>>> origin/main
import { Network } from '~types/network.interface';

import { OpenleverageContractFactory, OpenleverageLpool } from '../contracts';
import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';

const appId = OPENLEVERAGE_DEFINITION.id;
const groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

<<<<<<< HEAD
export type OpenleverageV0Details = {
  poolAddr: string;
  lendingYieldY: number;
  lend: string;
};
// Define a partial of the return type from the Openleverage API
export type OpenleverageV1Details = {
  poolsVOList: OpenleverageV0Details;
  data: any;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainOpenleveragePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OpenleverageContractFactory) private readonly openleverageContractFactory: OpenleverageContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://bnb.openleverage.finance/api/lends/pools';
    const { data } = await Axios.post<OpenleverageV1Details>(endpoint, {
      size: 1000,
      page: 1,
    }).then(v => v.data);

    const multicall = this.appToolkit.getMulticall(network);
    const v0List = [] as any;

    data.forEach(({ poolsVOList }) => {
      poolsVOList.forEach(poolModel => {
        v0List.push(poolModel);
      });
    });

    const poolAddresses = await Promise.all(
      v0List.map(async poolModel => {
        const poolContract = this.openleverageContractFactory.openleverageLpool({
          address: poolModel.poolAddr,
          network,
        });
=======
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
export class BinanceSmartChainOpenleveragePoolTokenFetcher extends AppTokenTemplatePositionFetcher<OpenleverageLpool> {
  appId = OPENLEVERAGE_DEFINITION.id;
  groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OpenleverageContractFactory) protected readonly contractFactory: OpenleverageContractFactory,
  ) {
    super(appToolkit);
  }
>>>>>>> origin/main

  async getAddresses() {
    const endpoint = `https://api.thegraph.com/subgraphs/name/openleveragedev/openleverage-bsc`;
    const data = await this.appToolkit.helpers.theGraphHelper.request<OpenLeveragePoolsResponse>({ endpoint, query });
    return data.pools.map(v => v.id);
  }

<<<<<<< HEAD
        return {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: poolModel.poolAddr,
          network,
          symbol: poolModel.token0Icon,
          decimals: poolModel.tokenDecimals,
          supply: poolModel.totalLending,
          tokens: [poolModel.token0Addr, poolModel.token1Addr],
          pricePerShare: Number(pricePerShare.toString()),
        };
      }),
    );

    return poolAddresses;
=======
  getContract(address: string) {
    return this.contractFactory.openleverageLpool({ address, network });
  }

  getUnderlyingTokenAddresses(contract: OpenleverageLpool) {
    return contract.underlying();
  }

  async getPricePerShare(contract: OpenleverageLpool) {
    const exchangeRateCurrent = await contract.exchangeRateStored();
    return Number(exchangeRateCurrent) / 10 ** 18;
  }

  async getDataProps({ appToken }: DataPropsStageParams<OpenleverageLpool>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }

  async getLabel({ appToken }: DisplayPropsStageParams<OpenleverageLpool>) {
    return getLabelFromToken(appToken.tokens[0]);
>>>>>>> origin/main
  }
}
