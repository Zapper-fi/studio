import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact, uniqBy } from 'lodash';
import { EthersMulticall } from '~multicall';

import { CurvePoolTokenHelper, CurveVirtualPriceStrategy } from '~apps/curve';
import { CurvePoolDefinition } from '~apps/curve/curve.types';
import { Erc20 } from '~contract/contracts';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
  // Ferro DAI/USDC/USDT
  {
    swapAddress: '0xe8d13664a42b338f009812fa5a75199a865da5cd',
    tokenAddress: '0x71923713685770d04d69d103008aaffeebc31bde',
  },
];

export const FERRO_METAPOOL_DEFINITIONS: CurvePoolDefinition[] = [
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class CronosFerroPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(FerroContractFactory) private readonly ferroContractFactory: FerroContractFactory,
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurveVirtualPriceStrategy)
    private readonly curveVirtualPriceStrategy: CurveVirtualPriceStrategy,
  ) {}

  async getPositions() {
    const basePools = await this.curvePoolTokenHelper.getTokens<FerroSwap, Erc20>({
      network,
      appId,
      groupId,
      resolvePoolDefinitions: async () => FERRO_BASEPOOL_DEFINITIONS,
      resolvePoolContract: ({ network, definition }) =>
        this.ferroContractFactory.ferroSwap({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.ferroContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses,
      resolvePoolReserves: async ({ poolContract, multicall }) => {
        const tokenBalances = await Promise.all([
          multicall
            .wrap(poolContract)
            .getTokenBalance(0)
            .then(v => v.toString())
            .catch(() => null),
          multicall
            .wrap(poolContract)
            .getTokenBalance(1)
            .then(v => v.toString())
            .catch(() => null),
          multicall
            .wrap(poolContract)
            .getTokenBalance(2)
            .then(v => v.toString())
            .catch(() => null),
        ]);

        return compact(tokenBalances);
      },
      resolvePoolFee: async () => BigNumber.from('4000000'),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: this.curveVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
    });

    const metaPools = await this.curvePoolTokenHelper.getTokens<FerroSwap, Erc20>({
      network,
      appId,
      groupId,
      baseCurveTokens: basePools,
      resolvePoolDefinitions: async () => FERRO_METAPOOL_DEFINITIONS,
      resolvePoolContract: ({ network, definition }) =>
        this.ferroContractFactory.ferroSwap({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.ferroContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses,
      resolvePoolReserves,
      resolvePoolFee: async () => BigNumber.from('4000000'),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: this.curveVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).getVirtualPrice(),
      }),
    });

    return uniqBy([basePools, metaPools].flat(), v => v.address);
  }
}

const resolvePoolCoinAddresses = async ({
  poolContract, multicall,
}: {
  poolContract: FerroSwap,
  multicall: EthersMulticall,
}) => {
  const tokenAddresses = await Promise.all([
    multicall
    .wrap(poolContract)
    .getToken(0)
    .catch(() => null),
      multicall
    .wrap(poolContract)
    .getToken(1)
    .catch(() => null),
      multicall
    .wrap(poolContract)
    .getToken(2)
    .catch(() => null),
  ]);

  return compact(tokenAddresses).map(v => v.toLowerCase());
};

const resolvePoolReserves = async ({
  poolContract, multicall
}: {
  poolContract: FerroSwap,
  multicall: EthersMulticall,
}) => {
  const tokenBalances = await Promise.all([
    multicall
    .wrap(poolContract)
    .getTokenBalance(0)
    .then(v => v.toString())
    .catch(() => null),
      multicall
    .wrap(poolContract)
    .getTokenBalance(1)
    .then(v => v.toString())
    .catch(() => null),
      multicall
    .wrap(poolContract)
    .getTokenBalance(2)
    .then(v => v.toString())
    .catch(() => null),
  ]);

  return compact(tokenBalances);
};
