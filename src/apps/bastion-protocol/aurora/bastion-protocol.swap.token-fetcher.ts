import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurvePoolTokenHelper } from '~apps/curve';
import { CurvePoolDefinition } from '~apps/curve/curve.types';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolContractFactory } from '../contracts';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.swap.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class AuroraBastionProtocolSwapTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurvePoolTokenHelper) private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(BastionProtocolContractFactory)
    private readonly bastionProtocolContractFactory: BastionProtocolContractFactory,
  ) {}

  async getLPTokenPrice({ tokens, reserves, poolContract, multicall, supply }) {
    const virtualPriceRaw = await multicall.wrap(poolContract).getVirtualPrice();
    const virtualPrice = Number(virtualPriceRaw) / 10 ** 18;
    const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
    const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
    return virtualPrice > 0 ? virtualPrice * (liquidity / supply) : liquidity / supply;
  }

  async getPositions() {
    const poolDefinitions: CurvePoolDefinition[] = [
      {
        queryKey: 'cusdccusdt',
        label: 'cUSDC/cUSDT Pool',
        swapAddress: '0x6287e912a9Ccd4D5874aE15d3c89556b2a05f080',
        tokenAddress: '0x0039f0641156cac478b0DebAb086D78B66a69a01',
      },
    ];
    const appTokenDefinition = [
      {
        appId,
        groupIds: [BASTION_PROTOCOL_DEFINITION.groups.supply.id],
        network,
      },
    ];
    return this.curvePoolTokenHelper.getTokens({
      network,
      appId,
      groupId,
      appTokenDependencies: appTokenDefinition,
      resolvePoolDefinitions: async () => poolDefinitions,
      resolvePoolContract: ({ network, definition }) =>
        this.bastionProtocolContractFactory.bastionProtocolSwap({ address: definition.swapAddress, network }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.bastionProtocolContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses: ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).getToken(0), multicall.wrap(poolContract).getToken(1)]),
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
      resolvePoolVolume: undefined,
      resolvePoolFee: ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .swapStorage()
          .then(r => r.swapFee),
      resolvePoolTokenPrice: this.getLPTokenPrice,
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
    });
  }
}
