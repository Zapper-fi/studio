import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import {
  CurvePoolOnChainCoinStrategy,
  CurvePoolOnChainReserveStrategy,
  CurvePoolTokenHelper,
  CurvePoolVirtualPriceStrategy,
} from '~apps/curve';
import { CurvePoolDefinition } from '~apps/curve/curve.types';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { FerroContractFactory, FerroSwap } from '../contracts';
import { FERRO_DEFINITION } from '../ferro.definition';

const appId = FERRO_DEFINITION.id;
const groupId = FERRO_DEFINITION.groups.pool.id;
const network = Network.CRONOS_MAINNET;

export const FERRO_BASEPOOL_DEFINITIONS: CurvePoolDefinition[] = [
  // 3FER DAI/USDC/USDT
  {
    swapAddress: '0xe8d13664a42b338f009812fa5a75199a865da5cd',
    tokenAddress: '0x71923713685770d04d69d103008aaffeebc31bde',
  },
  // 2FER USDC/USDT
  {
    swapAddress: '0xa34c0fe36541fb085677c36b4ff0ccf5fa2b32d6',
    tokenAddress: '0xd05a67bb1e9684e8ddd19d0bb6a713b4befc2c03',
  },
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class CronosFerroPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(FerroContractFactory) private readonly ferroContractFactory: FerroContractFactory,
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurvePoolOnChainCoinStrategy)
    private readonly curvePoolOnChainCoinStrategy: CurvePoolOnChainCoinStrategy,
    @Inject(CurvePoolOnChainReserveStrategy)
    private readonly curvePoolOnChainReserveStrategy: CurvePoolOnChainReserveStrategy,
    @Inject(CurvePoolVirtualPriceStrategy)
    private readonly curvePoolVirtualPriceStrategy: CurvePoolVirtualPriceStrategy,
  ) {}

  getPositions() {
    return this.curvePoolTokenHelper.getTokens<FerroSwap>({
      network,
      appId,
      groupId,
      poolDefinitions: FERRO_BASEPOOL_DEFINITIONS,
      resolvePoolContract: ({ network, address }) =>
        this.ferroContractFactory.ferroSwap({ network, address }),
      resolvePoolCoinAddresses: this.curvePoolOnChainCoinStrategy.build({
        resolveCoinAddress: ({ multicall, poolContract, index }) => multicall.wrap(poolContract).getToken(index),
      }),
      resolvePoolReserves: this.curvePoolOnChainReserveStrategy.build({
        resolveReserve: ({ multicall, poolContract, index }) => multicall.wrap(poolContract).getTokenBalance(index),
      }),
      resolvePoolFee: async () => BigNumber.from('4000000'),
      resolvePoolTokenPrice: this.curvePoolVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
    });
  }
}
