import { Inject, Injectable } from '@nestjs/common';
import { compact, range, uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { TrisolarisContractFactory } from '../contracts';
import TRISOLARIS_DEFINITION from '../trisolaris.definition';

@Injectable()
export class AuroraTrisolarisPoolAddressCacheManager {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TrisolarisContractFactory) protected readonly contractFactory: TrisolarisContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${TRISOLARIS_DEFINITION.id}:chef-v2-pool-addresses`,
    timeout: 15 * 60 * 1000,
  })
  private async getChefV2PoolAddresses() {
    const network = Network.AURORA_MAINNET;
    const chefAddress = '0x3838956710bcc9d122dd23863a0549ca8d5675d6';
    const chefContract = this.contractFactory.trisolarisMasterChef({ address: chefAddress, network });

    const provider = this.appToolkit.getNetworkProvider(network);
    const multicall = this.appToolkit.getMulticall(network);
    const numPools = await multicall.wrap(chefContract).poolLength();

    const allAddresses = await Promise.all(
      range(0, Number(numPools)).map(async v => {
        const lpTokenAddressRaw = await multicall.wrap(chefContract).lpToken(v);
        const lpTokenAddress = lpTokenAddressRaw.toLowerCase();
        const lpTokenContract = this.contractFactory.trisolarisPair({ address: lpTokenAddress, network });

        // Some EOAs exist on the MasterChef contract; calling these breaks multicall
        const code = await provider.getCode(lpTokenAddress);
        if (code === '0x') return null;

        const isPool = await multicall
          .wrap(lpTokenContract)
          .token0()
          .then(() => true)
          .catch(() => false);
        if (!isPool) return null;

        return lpTokenAddress;
      }),
    );

    return compact(allAddresses);
  }

  async getPoolAddresses(): Promise<string[]> {
    const [chefV2PoolAddresses] = await Promise.all([this.getChefV2PoolAddresses()]);
    return uniq([...chefV2PoolAddresses]);
  }
}
