import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapV2OnChainPoolTokenAddressStrategy } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HakuswapContractFactory } from '../contracts';
import { HAKUSWAP_DEFINITION } from '../hakuswap.definition';
import { HakuswapPoolTokenHelper } from '../helpers/hakuswap.pool.token-helper';

const poolNotUsingDecimals = [
  '0x519de4668ea6661d1870928a3033a62dc2acc503',
  '0x1f0bc5c91518d903c0c097bde9741746b4423008',
  '0x29e144ea1abac02b62be7afb877d1bbaca141295',
  '0x6075eccadfc2917d58062af55090b6bd3de258f5',
  '0x6c2782d9632efd35e93d33e25ba75c118682954c',
  '0x3152e0dd889045595d7635d8fc41965cea6209f2',
  '0xeffff893f9423fdb7a5c010cef202ea5a52575a6',
  '0x6f6a5f63cc7b7ddcad76752e633d45f3d5efb0e2',
  '0xffa26cb3458023c4b78c3d10f8bef4704c2fd198',
  '0x6bdd9d3ebb4be7289ccb8d7d8c6d95ee4a37ae7e',
  '0x022057df5019b8c165dda59c360cbc0842488c18',
  '0x8caf27646b392c7fdd49d8c55f3d93dd70cb1692',
];

const appId = HAKUSWAP_DEFINITION.id;
const groupId = HAKUSWAP_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheHakuswapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(HakuswapContractFactory) private readonly hakuswapContractFactory: HakuswapContractFactory,
    @Inject(HakuswapPoolTokenHelper) private readonly poolTokenHelper: HakuswapPoolTokenHelper,
    @Inject(UniswapV2OnChainPoolTokenAddressStrategy)
    private readonly uniswapV2OnChainPoolTokenAddressStrategy: UniswapV2OnChainPoolTokenAddressStrategy,
  ) {}

  async getPositions() {
    return this.poolTokenHelper.getTokens({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0x2db46feb38c57a6621bca4d97820e1fc1de40f41',
      poolNotUsingDecimals,
      resolveFactoryContract: ({ address, network }) =>
        this.hakuswapContractFactory.hakuswapFactory({
          address,
          network,
        }),
      resolvePoolContract: ({ address, network }) => this.hakuswapContractFactory.hakuswapPool({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2OnChainPoolTokenAddressStrategy.build({
        resolvePoolsLength: ({ multicall, factoryContract }) => multicall.wrap(factoryContract).allPairsLength(),
        resolvePoolAddress: ({ multicall, factoryContract, poolIndex }) =>
          multicall.wrap(factoryContract).allPairs(poolIndex),
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: async ({ multicall, poolContract }) => {
        const reserves = await multicall.wrap(poolContract).getReserves();
        return [reserves[0], reserves[1]];
      },
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) => {
        return Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]);
      },
    });
  }
}
