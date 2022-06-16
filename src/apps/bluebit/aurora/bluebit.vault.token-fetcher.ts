import { Inject } from '@nestjs/common';
import { uniq } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { UniswapPair, UniswapV2ContractFactory, UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BLUEBIT_DEFINITION } from '../bluebit.definition';
import { Bluebit, BluebitContractFactory } from '../contracts';

const appId = BLUEBIT_DEFINITION.id;
const groupId = BLUEBIT_DEFINITION.groups.vault.id;
const network = Network.AURORA_MAINNET;

const zeroAddress = '0x0000000000000000000000000000000000000000';
const statsAddress = '0x36C6FBA304009a036BaaE1a24a570B450Ae14a5C';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBluebitVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2ContractFactory) private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BluebitContractFactory) private readonly bluebitContractFactory: BluebitContractFactory,
  ) {}

  async getVaults() {
    const stats = this.bluebitContractFactory.stats({ address: statsAddress, network: network });
    const vaults: any = await stats.vaults(zeroAddress);
    let items: any = [];
    for (let i = 0; i < vaults.length; i++) {
      const pair = this.uniswapV2ContractFactory.uniswapPair({ address: vaults[i].token, network });
      try {
        await pair.token0();
        items.push(vaults[i].token.toLowerCase());
      } catch (error) {}
    }
    items = uniq(items);
    return items;
  }

  async getPositions() {
    return this.poolTokenHelper.getTokens<Bluebit, UniswapPair>({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0xc66F594268041dB60507F00703b152492fb176E7',
      resolveFactoryContract: opts => this.bluebitContractFactory.bluebit(opts),
      resolvePoolContract: opts => this.uniswapV2ContractFactory.uniswapPair(opts),
      resolvePoolTokenAddresses: () => this.getVaults(),
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
