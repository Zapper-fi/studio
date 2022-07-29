import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { uniqBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import {
  CurvePoolOnChainCoinStrategy,
  CurvePoolOnChainReserveStrategy,
  CurvePoolTokenHelper,
  CurvePoolVirtualPriceStrategy,
} from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KinesisLabsContractFactory, KinesisLabsPool } from '../contracts';
import { KINESIS_LABS_DEFINITION } from '../kinesis-labs.definition';

import { KINESIS_LABS_BASEPOOL_DEFINITIONS } from './kinesis-labs.pool.definitions';

const appId = KINESIS_LABS_DEFINITION.id;
const groupId = KINESIS_LABS_DEFINITION.groups.pool.id;
const network = Network.EVMOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EvmosKinesisLabsPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurvePoolOnChainCoinStrategy)
    private readonly curvePoolOnChainCoinStrategy: CurvePoolOnChainCoinStrategy,
    @Inject(CurvePoolOnChainReserveStrategy)
    private readonly curvePoolOnChainReserveStrategy: CurvePoolOnChainReserveStrategy,
    @Inject(CurvePoolVirtualPriceStrategy)
    private readonly curvePoolVirtualPriceStrategy: CurvePoolVirtualPriceStrategy,
    @Inject(KinesisLabsContractFactory)
    private readonly kinesisLabsContractFactory: KinesisLabsContractFactory,
  ) {}

  async getPositions() {
    const basePools = await this.curvePoolTokenHelper.getTokens<KinesisLabsPool>({
      network,
      appId,
      groupId,
      poolDefinitions: KINESIS_LABS_BASEPOOL_DEFINITIONS,
      resolvePoolContract: ({ network, address }) =>
        this.kinesisLabsContractFactory.kinesisLabsPool({ network, address }),
      resolvePoolCoinAddresses: this.curvePoolOnChainCoinStrategy.build({
        resolveCoinAddress: ({ multicall, poolContract, index }) => multicall.wrap(poolContract).getToken(index),
      }),
      resolvePoolReserves: this.curvePoolOnChainReserveStrategy.build({
        resolveReserve: ({ multicall, poolContract, index }) => multicall.wrap(poolContract).getTokenBalance(index),
      }),
      resolvePoolTokenPrice: this.curvePoolVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
      resolvePoolFee: async () => BigNumber.from('4000000'),
    });

    return uniqBy([basePools].flat(), v => v.address);
  }
}
