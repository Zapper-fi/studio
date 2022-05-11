import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { UniswapFactory, UniswapPair, UniswapV2ContractFactory } from '../contracts';
import { UniswapV2PoolTokenHelper } from '../helpers/uniswap-v2.pool.token-helper';
import { UniswapV2TheGraphPoolTokenAddressStrategy } from '../helpers/uniswap-v2.the-graph.pool-token-address-strategy';
import { UniswapV2TheGraphPoolVolumeStrategy } from '../helpers/uniswap-v2.the-graph.pool-volume-strategy';
import UNISWAP_V2_DEFINITION from '../uniswap-v2.definition';

const appId = UNISWAP_V2_DEFINITION.id;
const groupId = UNISWAP_V2_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumUniswapV2PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2ContractFactory)
    private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
    @Inject(UniswapV2PoolTokenHelper)
    private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2TheGraphPoolTokenAddressStrategy)
    private readonly uniswapV2TheGraphPoolTokenAddressStrategy: UniswapV2TheGraphPoolTokenAddressStrategy,
    @Inject(UniswapV2TheGraphPoolVolumeStrategy)
    private readonly uniswapV2TheGraphPoolVolumeStrategy: UniswapV2TheGraphPoolVolumeStrategy,
  ) {}

  async getPositions() {
    return this.uniswapV2PoolTokenHelper.getTokens<UniswapFactory, UniswapPair>({
      network,
      appId,
      groupId: UNISWAP_V2_DEFINITION.groups.pool.id,
      factoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
      hiddenTokens: ['0x62359ed7505efc61ff1d56fef82158ccaffa23d7', '0x35bd01fc9d6d5d81ca9e055db88dc49aa2c699a8'],
      blockedPools: ['0x9cbfb60a09a9a33a10312da0f39977cbdb7fde23'], // Uniswap V2: SAITAMA - has a transfer fee (not supported by our zap)
      appTokenDependencies: [
        {
          appId: 'alpha-v1',
          groupIds: ['lending'],
          network,
        },
      ],
      resolveFactoryContract: ({ address, network }) =>
        this.uniswapV2ContractFactory.uniswapFactory({ address, network }),
      resolvePoolContract: ({ address, network }) => this.uniswapV2ContractFactory.uniswapPair({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2TheGraphPoolTokenAddressStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        first: 1000,
        requiredPools: [
          '0xaad22f5543fcdaa694b68f94be177b561836ae57', // sUSD-$BASED
          '0xe98f89a2b3aecdbe2118202826478eb02434459a', // DAI-DEBASE
          '0x980a07e4f64d21a0cb2ef8d4af362a79b9f5c0da', // DAI-BSGS
          '0xf58d2bacbc68c587730ea0ce5131f6ae7c622a5d', // ORCL5-ETH
          '0xc3601f3e1c26d1a47571c559348e4156786d1fec', // DUCK-WETH
          '0xcadd30b39f01cfdfb848174b19bbb5b1b7486159', // DSU-ESS
          '0x0bf46ba06dc1d33c3bd80ff42497ebff13a88900', // rDPX- ETH
          '0xfd0a40bc83c5fae4203dec7e5929b446b07d1c76', // FRAX-ETH
          '0x97c4adc5d28a86f9470c70dd91dc6cc2f20d2d4d', // FRAX-USDC
          '0x5d447fc0f8965ced158bab42414af10139edf0af', // MIR/UST
          '0xbc07342d01ff5d72021bb4cb95f07c252e575309', // mVIXY/UST
          '0x1fabef2c2dab77f01053e9600f70be1f3f657f51', // mAMZN/UST
          '0x29cf719d134c1c18dab61c2f4c0529c4895ecf44', // mNFLX/UST
          '0x43dfb87a26ba812b0988ebdf44e3e341144722ab', // mTSLA/UST
          '0x27a14c03c364d3265e0788f536ad8d7afb0695f7', // mMSFT/UST
          '0xc1d2ca26a59e201814bf6af633c3b3478180e91f', // mQQQ/UST
          '0x2221518288af8c5d5a87fd32717fab154240d942', // mUSO/UST
          '0x5b64bb4f69c8c03250ac560aac4c7401d78a1c32', // mGOOGL/UST
          '0x99d737ab0df10cdc99c6f64d0384acd5c03aef7f', // mTWTR/UST
          '0x769325e8498bf2c2c3cfd6464a60fa213f26afcc', // mBABA/UST
          '0x860425be6ad1345dc7a3e287facbf32b18bc4fae', // mSLV/UST
          '0xe214a6ca22be90f011f34fdddc7c5a07800f8bcd', // mIAU/UST
          '0x735659c8576d88a2eb5c810415ea51cb06931696', // mAAPL/UST
        ],
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: async ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .getReserves()
          .then(v => [v[0], v[1]]),
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]),
      resolveTokenDisplaySymbol: token => (token.symbol === 'WETH' ? 'ETH' : token.symbol),
      resolvePoolVolumes: this.uniswapV2TheGraphPoolVolumeStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        first: 1000,
        requiredPools: [
          '0xaad22f5543fcdaa694b68f94be177b561836ae57', // sUSD-$BASED
          '0xe98f89a2b3aecdbe2118202826478eb02434459a', // DAI-DEBASE
          '0x980a07e4f64d21a0cb2ef8d4af362a79b9f5c0da', // DAI-BSGS
          '0xf58d2bacbc68c587730ea0ce5131f6ae7c622a5d', // ORCL5-ETH
          '0xc3601f3e1c26d1a47571c559348e4156786d1fec', // DUCK-WETH
          '0xcadd30b39f01cfdfb848174b19bbb5b1b7486159', // DSU-ESS
          '0x0bf46ba06dc1d33c3bd80ff42497ebff13a88900', // rDPX- ETH
          '0xfd0a40bc83c5fae4203dec7e5929b446b07d1c76', // FRAX-ETH
        ],
      }),
    });
  }
}
