import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { uniqBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { CurvePoolTokenHelper, CurvePoolVirtualPriceStrategy } from '~apps/curve';
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
    @Inject(CurvePoolVirtualPriceStrategy)
    private readonly curvePoolVirtualPriceStrategy: CurvePoolVirtualPriceStrategy,
    @Inject(KinesisLabsContractFactory) private readonly kinesisLabsContractFactory: KinesisLabsContractFactory,
  ) {}

  async getPositions() {
    const basePools = await this.curvePoolTokenHelper.getTokens<KinesisLabsPool>({
      network,
      appId,
      groupId,
      poolDefinitions: KINESIS_LABS_BASEPOOL_DEFINITIONS,
      resolvePoolContract: ({ network, definition }) =>
        this.kinesisLabsContractFactory.kinesisLabsPool({ network, address: definition.swapAddress }),
      resolvePoolReserves: ({ definition, multicall, poolContract }) =>
        Promise.all(definition.coinAddresses.map((_, i) => multicall.wrap(poolContract).getTokenBalance(i))),
      resolvePoolFee: async () => BigNumber.from('4000000'),
      resolvePoolTokenPrice: this.curvePoolVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
    });

    return uniqBy([basePools].flat(), v => v.address);
  }
}
