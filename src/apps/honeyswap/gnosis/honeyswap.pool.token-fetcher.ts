import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2PoolSubgraphTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.subgraph.template.token-fetcher';

import { HoneyswapContractFactory, HoneyswapPair } from '../contracts';

@PositionTemplate()
export class GnosisHoneyswapPoolTokenFetcher extends UniswapV2PoolSubgraphTemplateTokenFetcher<HoneyswapPair> {
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-xdai';
  factoryAddress = '0x9ad6c38be94206ca50bb0d90783181662f0cfa10';
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HoneyswapContractFactory) protected readonly contractFactory: HoneyswapContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): HoneyswapPair {
    return this.contractFactory.honeyswapPair({ address, network: this.network });
  }

  getPoolToken0(contract: HoneyswapPair): Promise<string> {
    return contract.token0();
  }

  getPoolToken1(contract: HoneyswapPair): Promise<string> {
    return contract.token1();
  }

  getPoolReserves(contract: HoneyswapPair): Promise<BigNumberish[]> {
    return contract.getReserves();
  }
}
