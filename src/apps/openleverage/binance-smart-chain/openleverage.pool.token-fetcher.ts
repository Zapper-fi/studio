import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OpenleverageContractFactory } from '../contracts';
import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';
import Axios from 'axios';
import BigNumberJS from 'bignumber.js';
import { ContractType } from '~position/contract.interface';


const appId = OPENLEVERAGE_DEFINITION.id;
const groupId = OPENLEVERAGE_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;


export type OpenleverageV0Details = {
  poolAddr: string;
  lendingYieldY: number;
  lend: string;
}
// Define a partial of the return type from the Openleverage API
export type OpenleverageV1Details = {
  poolsVOList: OpenleverageV0Details,
  data: any
};


@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainOpenleveragePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OpenleverageContractFactory) private readonly openleverageContractFactory: OpenleverageContractFactory,
  ) { }

  async getPositions() {
    const endpoint = "https://bnb.openleverage.finance/api/lends/pools";
    const { data } = await Axios.post<OpenleverageV1Details>(endpoint, {
      size: 1000,
      page: 1
    }).then(
      (v) => v.data
    );

    const multicall = this.appToolkit.getMulticall(network);
    const v0List = [] as any;

    data.forEach(({ poolsVOList }) => {
      poolsVOList.forEach((poolModel) => {
        v0List.push(poolModel);
      })
    })


    const poolAddresses = await Promise.all(

      v0List.map(async poolModel => {
        const poolContract = this.openleverageContractFactory.openleverageLpool({
          address: poolModel.poolAddr,
          network
        })

        const [exchangeRateCurrent] = await Promise.all([multicall.wrap(poolContract).exchangeRateStored()]);
        const pricePerShare = new BigNumberJS(exchangeRateCurrent.toString()).dividedBy(new BigNumberJS(10).pow(18));



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
          pricePerShare: Number(pricePerShare.toString())
        }
      })
    )

    return poolAddresses;

  }
}
