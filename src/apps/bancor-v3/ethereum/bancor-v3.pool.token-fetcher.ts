import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANCOR_V3_DEFINITION } from '../bancor-v3.definition';
import { BancorV3ContractFactory, BntPool, PoolCollection, PoolToken } from '../contracts';

const appId = BANCOR_V3_DEFINITION.id;
const groupId = BANCOR_V3_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;
const poolCollectionAddress = '0xec9596e0eb67228d61a12cfdb4b3608281f261b3'.toLowerCase();
const bntPoolAddress = '0x02651E355D26f3506C1E644bA393FDD9Ac95EaCa'.toLowerCase();

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumBancorV3TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ContractFactory) private readonly contractFactory: BancorV3ContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const poolContract: PoolCollection = this.contractFactory.poolCollection({
      address: poolCollectionAddress,
      network,
    });
    const pools = await Promise.all(
      (
        await multicall.wrap(poolContract).pools()
      ).map(async (poolAddress: string) => (await multicall.wrap(poolContract).poolToken(poolAddress)).toLowerCase()),
    );
    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<PoolToken>({
      appId: BANCOR_V3_DEFINITION.id,
      groupId: BANCOR_V3_DEFINITION.groups.pool.id,
      network: Network.ETHEREUM_MAINNET,
      resolveVaultAddresses: () => pools,
      resolveContract: ({ address, network }) => this.contractFactory.poolToken({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .reserveToken()
          .then(a => (a.toLowerCase() === ETH_ADDR_ALIAS ? ZERO_ADDRESS : a.toLowerCase())),
      resolveReserve: () => 0,
      resolvePricePerShare: ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .reserveToken()
          .then(address =>
            multicall
              .wrap(poolContract)
              .poolTokenToUnderlying(address, (10 ** underlyingToken.decimals).toString())
              .then(ratio => Number(ratio) / 10 ** underlyingToken.decimals),
          ),
    });

    const bntPoolContract = this.contractFactory.bntPool({ address: bntPoolAddress, network });
    const bnToken = await this.appToolkit.helpers.vaultTokenHelper.getTokens<BntPool>({
      appId: BANCOR_V3_DEFINITION.id,
      groupId: BANCOR_V3_DEFINITION.groups.pool.id,
      network: Network.ETHEREUM_MAINNET,
      resolveVaultAddresses: () =>
        multicall
          .wrap(bntPoolContract)
          .poolToken()
          .then(a => [a.toLowerCase()]),
      resolveContract: ({ address, network }) => this.contractFactory.bntPool({ address, network }),
      resolveUnderlyingTokenAddress: () => '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', // BNT
      resolveReserve: () => 0,
      resolvePricePerShare: ({ multicall, underlyingToken }) =>
        multicall
          .wrap(bntPoolContract)
          .poolTokenToUnderlying((10 ** underlyingToken.decimals).toString())
          .then(ratio => Number(ratio) / 10 ** underlyingToken.decimals),
    });

    return [...tokens, ...bnToken];
  }
}
