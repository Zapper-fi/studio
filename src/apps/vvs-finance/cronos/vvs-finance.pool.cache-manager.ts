import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact, range, uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const network = Network.CRONOS_MAINNET;

@Injectable()
export class CronosVvsFinancePoolAddressCacheManager {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) protected readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  @CacheOnInterval({
    key: `apps-v3:${VVS_FINANCE_DEFINITION.id}:graph-top-pool-addresses`,
    timeout: 15 * 60 * 1000,
  })
  private async getTopPoolAddresses() {
    return [];
  }

  @CacheOnInterval({
    key: `apps-v3:${VVS_FINANCE_DEFINITION.id}:craftsman-pool-addresses`,
    timeout: 15 * 60 * 1000,
  })
  private async getCraftsmanPoolAddresses() {
    const craftsmanContract = this.contractFactory.vvsCraftsman({
      address: '0xdccd6455ae04b03d785f12196b492b18129564bc',
      network,
    });

    const provider = this.appToolkit.getNetworkProvider(network);
    const multicall = this.appToolkit.getMulticall(network);
    const numPools = await multicall.wrap(craftsmanContract).poolLength();

    const allAddresses = await Promise.all(
      range(0, Number(numPools)).map(async v => {
        const poolInfo = await multicall.wrap(craftsmanContract).poolInfo(v);
        const lpTokenAddress = poolInfo.lpToken.toLowerCase();
        const lpTokenContract = this.contractFactory.vvsPair({ address: lpTokenAddress, network });

        // Some EOAs exist on the MasterChef contract; calling these breaks multicall
        const code = await provider.getCode(lpTokenAddress);
        if (code === '0x') return false;

        const symbol = await multicall
          .wrap(lpTokenContract)
          .symbol()
          .catch(_err => '');

        const isVvsLp = symbol === 'VVS-LP';
        if (!isVvsLp) return null;

        return lpTokenAddress;
      }),
    );

    return compact(allAddresses);
  }

  @CacheOnInterval({
    key: `apps-v3:${VVS_FINANCE_DEFINITION.id}:craftsman-v2-pools`,
    timeout: 15 * 60 * 1000,
  })
  async getCraftsmanV2Pools() {
    const multicall = this.appToolkit.getMulticall(network);
    const craftsmanV2Contract = multicall.wrap(
      this.contractFactory.vvsCraftsmanV2({
        address: '0xbc149c62efe8afc61728fc58b1b66a0661712e76',
        network,
      }),
    );

    const resolvedPoolIds: BigNumber[] = [];
    let index = 0;
    let indexWithinRange = true;
    while (indexWithinRange) {
      try {
        const poolId = await craftsmanV2Contract.poolIds(index);
        resolvedPoolIds.push(poolId);
        index++;
      } catch (_error) {
        // index out of range
        indexWithinRange = false;
      }
    }

    const pools = await Promise.all(
      resolvedPoolIds.map(async poolId => {
        const { lpToken, accVVSPerShare } = await craftsmanV2Contract.poolInfo(poolId);

        return {
          poolId,
          lpToken,
          accVVSPerShare,
        };
      }),
    );

    return pools;
  }

  @CacheOnInterval({
    key: `apps-v3:${VVS_FINANCE_DEFINITION.id}:craftsman-v2-pool-addresses`,
    timeout: 15 * 60 * 1000,
  })
  private async getCraftsmanV2PoolAddresses() {
    const pools = await this.getCraftsmanV2Pools();
    if (!pools) return [];

    const provider = this.appToolkit.getNetworkProvider(network);
    const multicall = this.appToolkit.getMulticall(network);

    const craftsmanV2PoolAddresses = await Promise.all(
      pools.map(async pool => {
        const lpTokenAddress = pool.lpToken.toLowerCase();
        const lpTokenContract = this.contractFactory.vvsPair({ address: lpTokenAddress, network });

        // Some EOAs exist on the MasterChef contract; calling these breaks multicall
        const code = await provider.getCode(lpTokenAddress);
        if (code === '0x') return false;

        const symbol = await multicall
          .wrap(lpTokenContract)
          .symbol()
          .catch(_err => '');

        const isVvsLp = symbol === 'VVS-LP';
        if (!isVvsLp) return null;

        return lpTokenAddress;
      }),
    );

    return compact(craftsmanV2PoolAddresses);
  }

  private async getStaticPoolAddresses() {
    return [];
  }

  async getPoolAddresses(): Promise<string[]> {
    const [topPoolAddresses, craftsmanPoolAddresses, craftsmanV2PoolAddresses, staticPoolAddresses] = await Promise.all(
      [
        this.getTopPoolAddresses(),
        this.getCraftsmanPoolAddresses(),
        this.getCraftsmanV2PoolAddresses(),
        this.getStaticPoolAddresses(),
      ],
    );

    return uniq([...topPoolAddresses, ...craftsmanPoolAddresses, ...craftsmanV2PoolAddresses, ...staticPoolAddresses]);
  }
}
