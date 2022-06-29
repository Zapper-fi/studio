import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import { CurvePoolTokenHelper, CurveVirtualPriceStrategy } from '~apps/curve';
import { Erc20 } from '~contract/contracts';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SaddleContractFactory, SaddleSwap } from '../contracts';
import { SaddleOnChainCoinStrategy } from '../helpers/saddle.on-chain.coin-strategy';
import { SaddleOnChainReserveStrategy } from '../helpers/saddle.on-chain.reserve-strategy';
import { SADDLE_DEFINITION } from '../saddle.definition';

import { SADDLE_BASEPOOL_DEFINITIONS } from './saddle.pool.definitions';

@Register.TokenPositionFetcher({
  appId: SADDLE_DEFINITION.id,
  groupId: SADDLE_DEFINITION.groups.pool.id,
  network: Network.EVMOS_MAINNET,
})
export class EvmosSaddlePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(SaddleOnChainCoinStrategy)
    private readonly saddleOnChainCoinStrategy: SaddleOnChainCoinStrategy,
    @Inject(SaddleOnChainReserveStrategy)
    private readonly saddleOnChainReserveStrategy: SaddleOnChainReserveStrategy,
    @Inject(CurveVirtualPriceStrategy)
    private readonly curveVirtualPriceStrategy: CurveVirtualPriceStrategy,
    @Inject(SaddleContractFactory)
    private readonly saddleContractFactory: SaddleContractFactory,
  ) {}

  async getPositions() {
    const basePools = await this.curvePoolTokenHelper.getTokens<SaddleSwap, Erc20>({
      network: Network.EVMOS_MAINNET,
      appId: SADDLE_DEFINITION.id,
      groupId: SADDLE_DEFINITION.groups.pool.id,
      resolvePoolDefinitions: async () => SADDLE_BASEPOOL_DEFINITIONS,
      resolvePoolContract: ({ network, definition }) =>
        this.saddleContractFactory.saddleSwap({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.saddleContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses: this.saddleOnChainCoinStrategy.build(),
      resolvePoolReserves: this.saddleOnChainReserveStrategy.build(),
      resolvePoolFee: async () => BigNumber.from('4000000'),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: this.curveVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
    });

    return basePools;
  }
}
