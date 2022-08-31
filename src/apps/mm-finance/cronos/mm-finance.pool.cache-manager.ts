import { Inject, Injectable } from '@nestjs/common';
import { compact, range, uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { MmFinanceContractFactory } from '../contracts';
import { MM_FINANCE_DEFINITION } from '../mm-finance.definition';

@Injectable()
export class CronosMmFinancePoolAddressCacheManager {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmFinanceContractFactory) protected readonly contractFactory: MmFinanceContractFactory,
  ) {}

  @CacheOnInterval({
    key: `apps-v3:${MM_FINANCE_DEFINITION.id}:chef-pool-addresses`,
    timeout: 15 * 60 * 1000,
  })
  private async getChefPoolAddresses() {
    const network = Network.CRONOS_MAINNET;
    const chefAddress = '0x6be34986fdd1a91e4634eb6b9f8017439b7b5edc';
    const chefContract = this.contractFactory.mmFinanceChef({ address: chefAddress, network });

    const provider = this.appToolkit.getNetworkProvider(network);
    const multicall = this.appToolkit.getMulticall(network);
    const numPools = await multicall.wrap(chefContract).poolLength();

    const allAddresses = await Promise.all(
      range(0, Number(numPools)).map(async v => {
        const poolInfo = await multicall.wrap(chefContract).poolInfo(v);
        const lpTokenAddress = poolInfo.lpToken.toLowerCase();
        const lpTokenContract = this.contractFactory.mmFinancePair({ address: lpTokenAddress, network });

        // Some EOAs exist on the MasterChef contract; calling these breaks multicall
        const code = await provider.getCode(lpTokenAddress);
        if (code === '0x') return false;

        const [symbol] = await Promise.all([
          multicall
            .wrap(lpTokenContract)
            .symbol()
            .catch(_err => ''),
        ]);

        const isMeerkatLP = symbol === 'MEERKAT-LP';
        if (!isMeerkatLP) return null;

        return lpTokenAddress;
      }),
    );

    return compact(allAddresses);
  }

  async getPoolAddresses(): Promise<string[]> {
    const [chefPoolAddresses] = await Promise.all([this.getChefPoolAddresses()]);
    return uniq([...chefPoolAddresses]);
  }
}
