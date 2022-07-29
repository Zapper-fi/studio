import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import {
  CurvePoolOnChainCoinStrategy,
  CurvePoolOnChainReserveStrategy,
  CurvePoolTokenHelper,
  CurvePoolVirtualPriceStrategy,
} from '~apps/curve';
import { CurvePoolDefinition, CurvePoolType } from '~apps/curve/curve.types';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolContractFactory, BastionProtocolSwap } from '../contracts';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.swap.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSwapTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BastionProtocolContractFactory)
    private readonly bastionProtocolContractFactory: BastionProtocolContractFactory,
    @Inject(CurvePoolTokenHelper) private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurvePoolOnChainCoinStrategy)
    private readonly curvePoolOnChainCoinStrategy: CurvePoolOnChainCoinStrategy,
    @Inject(CurvePoolOnChainReserveStrategy)
    private readonly curvePoolOnChainReserveStrategy: CurvePoolOnChainReserveStrategy,
    @Inject(CurvePoolVirtualPriceStrategy)
    private readonly curvePoolVirtualPriceStrategy: CurvePoolVirtualPriceStrategy,
  ) {}

  async getPositions() {
    const poolDefinitions: CurvePoolDefinition[] = [
      {
        swapAddress: '0x6287e912a9ccd4d5874ae15d3c89556b2a05f080',
        tokenAddress: '0x0039f0641156cac478b0debab086d78b66a69a01',
        poolType: CurvePoolType.CRYPTO,
      },
    ];

    const dependencies = [
      {
        appId,
        groupIds: [
          BASTION_PROTOCOL_DEFINITION.groups.supplyMainHub.id,
          BASTION_PROTOCOL_DEFINITION.groups.supplyStakedNear.id,
          BASTION_PROTOCOL_DEFINITION.groups.supplyAuroraEcosystem.id,
          BASTION_PROTOCOL_DEFINITION.groups.supplyMultichain.id,
        ],
        network,
      },
    ];

    return this.curvePoolTokenHelper.getTokens<BastionProtocolSwap>({
      network,
      appId,
      groupId,
      dependencies: dependencies,
      poolDefinitions: poolDefinitions,
      resolvePoolContract: ({ network, address }) =>
        this.bastionProtocolContractFactory.bastionProtocolSwap({ address, network }),
      resolvePoolCoinAddresses: this.curvePoolOnChainCoinStrategy.build({
        resolveCoinAddress: ({ multicall, index, poolContract }) => multicall.wrap(poolContract).getToken(index),
      }),
      resolvePoolReserves: this.curvePoolOnChainReserveStrategy.build({
        resolveReserve: ({ multicall, index, poolContract }) => multicall.wrap(poolContract).getTokenBalance(index),
      }),
      resolvePoolTokenPrice: this.curvePoolVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
      resolvePoolFee: ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .swapStorage()
          .then(r => r.swapFee),
    });
  }
}
