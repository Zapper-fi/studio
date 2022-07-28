import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurvePoolTokenHelper } from '~apps/curve';
import { CurvePoolDefinition } from '~apps/curve/helpers/pool/curve.pool-token.registry';
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
    @Inject(CurvePoolTokenHelper) private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(BastionProtocolContractFactory)
    private readonly bastionProtocolContractFactory: BastionProtocolContractFactory,
  ) {}

  async getPositions() {
    const poolDefinitions: CurvePoolDefinition[] = [
      {
        swapAddress: '0x6287e912a9ccd4d5874ae15d3c89556b2a05f080',
        tokenAddress: '0x0039f0641156cac478b0debab086d78b66a69a01',
        coinAddresses: ['0x845e15a441cfc1871b7ac610b0e922019bad9826', '0xe5308dc623101508952948b141fd9eabd3337d99'],
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
      resolvePoolContract: ({ network, definition }) =>
        this.bastionProtocolContractFactory.bastionProtocolSwap({ address: definition.swapAddress, network }),
      resolvePoolReserves: ({ multicall, poolContract }) =>
        Promise.all([
          multicall
            .wrap(poolContract)
            .getTokenBalance(0)
            .then(v => v.toString()),
          multicall
            .wrap(poolContract)
            .getTokenBalance(1)
            .then(v => v.toString()),
        ]),
      resolvePoolFee: ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .swapStorage()
          .then(r => r.swapFee),
      resolvePoolVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
    });
  }
}
