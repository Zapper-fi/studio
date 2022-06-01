import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { uniqBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { CurvePoolTokenHelper, CurveVirtualPriceStrategy } from '~apps/curve';
import { Erc20 } from '~contract/contracts';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KinesisLabsContractFactory, KinesisLabsPool } from '../contracts';
import { KinesisLabsOnChainCoinStrategy } from '../helpers/kinesis-labs.on-chain.coin-strategy';
import { KinesisLabsOnChainReserveStrategy } from '../helpers/kinesis-labs.on-chain.reserve-strategy';
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
    @Inject(KinesisLabsOnChainCoinStrategy)
    private readonly kinesisLabsOnChainCoinStrategy: KinesisLabsOnChainCoinStrategy,
    @Inject(KinesisLabsOnChainReserveStrategy)
    private readonly kinesisLabsOnChainReserveStrategy: KinesisLabsOnChainReserveStrategy,
    @Inject(CurveVirtualPriceStrategy)
    private readonly curveVirtualPriceStrategy: CurveVirtualPriceStrategy,
    @Inject(KinesisLabsContractFactory) private readonly kinesisLabsContractFactory: KinesisLabsContractFactory,
  ) {}

  async getPositions() {
    const basePools = await this.curvePoolTokenHelper.getTokens<KinesisLabsPool, Erc20>({
      network: network,
      appId: appId,
      groupId: groupId,
      resolvePoolDefinitions: async () => KINESIS_LABS_BASEPOOL_DEFINITIONS,
      resolvePoolContract: ({ network, definition }) =>
        this.kinesisLabsContractFactory.kinesisLabsPool({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.kinesisLabsContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses: this.kinesisLabsOnChainCoinStrategy.build(),
      resolvePoolReserves: this.kinesisLabsOnChainReserveStrategy.build(),
      resolvePoolFee: async () => BigNumber.from('4000000'),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: this.curveVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
    });

    return uniqBy([basePools].flat(), v => v.address);
  }
}
