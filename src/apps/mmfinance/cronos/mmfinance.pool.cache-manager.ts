import { Inject, Injectable } from '@nestjs/common';
import { compact, range, uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { MmfinanceContractFactory } from '../contracts';
import { MMFINANCE_DEFINITION } from '../mmfinance.definition';

@Injectable()
export class CronosChainMmfinancePoolAddressCacheManager {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmfinanceContractFactory) protected readonly contractFactory: MmfinanceContractFactory,
  ) {}

  // @CacheOnInterval({
  //   key: `apps-v3:${MMFINANCE_DEFINITION.id}:graph-top-pool-addresses`,
  //   timeout: 15 * 60 * 1000,
  // })
  // private async getTopPoolAddresses() {
  //   // @TODO Pull top 1000 pairs from https://bsc.streamingfast.io/subgraphs/name/mmfinance/exchange-v2
  //   // Use sortBy trackedReserveBNB
  //   return [];
  // }

  @CacheOnInterval({
    key: `apps-v3:${MMFINANCE_DEFINITION.id}:chef-pool-addresses`,
    timeout: 15 * 60 * 1000,
  })
  private async getChefPoolAddresses() {
    const network = Network.CRONOS_MAINNET;
    const chefAddress = '0x6bE34986Fdd1A91e4634eb6b9F8017439b7b5EDc';
    const chefContract = this.contractFactory.mmfinanceChef({ address: chefAddress, network });

    const provider = this.appToolkit.getNetworkProvider(network);
    const multicall = this.appToolkit.getMulticall(network);
    const numPools = await multicall.wrap(chefContract).poolLength();

    const allAddresses = await Promise.all(
      range(0, Number(numPools)).map(async v => {
        const poolInfo = await multicall.wrap(chefContract).poolInfo(v);
        const lpTokenAddress = poolInfo.lpToken.toLowerCase();
        const lpTokenContract = this.contractFactory.mmfinancePair({ address: lpTokenAddress, network });

        // Some EOAs exist on the MasterChef contract; calling these breaks multicall
        const code = await provider.getCode(lpTokenAddress);
        if (code === '0x') return false;

        const [symbol] = await Promise.all([
          multicall
            .wrap(lpTokenContract)
            .symbol()
            .catch(_err => ''),
        ]);
        // console.log(symbol, factoryAddressRaw);

        // We've deprecated V1 support since the liquidities are low now (also our zap does not support V1)
        // const V2_FACTORY_ADDRESS = '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4';
        // const isV2Pair = factoryAddressRaw.toLowerCase() === V2_FACTORY_ADDRESS;
        const isMeerkatLP = symbol === 'MEERKAT-LP';
        if (!isMeerkatLP) return null;
        // console.log(lpTokenAddress);
        return lpTokenAddress;
      }),
    );

    // console.log(allAddresses);
    return compact(allAddresses);
  }

  // @CacheOnInterval({
  //   key: `apps-v3:${MMFINANCE_DEFINITION.id}:chef-v2-pool-addresses`,
  //   timeout: 15 * 60 * 1000,
  // })
  // private async getChefV2PoolAddresses() {
  //   const network = Network.CRONOS_MAINNET;
  //   const chefAddress = '0x6bE34986Fdd1A91e4634eb6b9F8017439b7b5EDc';
  //   const chefContract = this.contractFactory.mmfinanceChefV2({ address: chefAddress, network });

  //   const provider = this.appToolkit.getNetworkProvider(network);
  //   const multicall = this.appToolkit.getMulticall(network);
  //   const numPools = await multicall.wrap(chefContract).poolLength();

  //   const allAddresses = await Promise.all(
  //     range(0, Number(numPools)).map(async v => {
  //       const lpTokenAddressRaw = await multicall.wrap(chefContract).lpToken(v);
  //       const lpTokenAddress = lpTokenAddressRaw.toLowerCase();
  //       const lpTokenContract = this.contractFactory.mmfinancePair({ address: lpTokenAddress, network });

  //       // Some EOAs exist on the MasterChef contract; calling these breaks multicall
  //       const code = await provider.getCode(lpTokenAddress);
  //       if (code === '0x') return false;

  //       const [symbol, factoryAddressRaw] = await Promise.all([
  //         multicall
  //           .wrap(lpTokenContract)
  //           .symbol()
  //           .catch(_err => ''),
  //         multicall
  //           .wrap(lpTokenContract)
  //           .factory()
  //           .catch(_err => ''),
  //       ]);

  //       // We've deprecated V1 support since the liquidities are low now (also our zap does not support V1)
  //       const V2_FACTORY_ADDRESS = '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4';
  //       const isV2Pair = factoryAddressRaw.toLowerCase() === V2_FACTORY_ADDRESS;
  //       const mme = symbol === 'Meerkat-LP';
  //       if (!isV2Pair || !mme) return null;

  //       return lpTokenAddress;
  //     }),
  //   );

  //   return compact(allAddresses);
  // }

  // @CacheOnInterval({
  //   key: `apps-v3:${MMFINANCE_DEFINITION.id}:static-pool-addresses`,
  //   timeout: 15 * 60 * 1000,
  // })
  // private async getStaticPoolAddresses() {
  //   return [''];
  // }
  async getPoolAddresses(): Promise<string[]> {
    const [chefPoolAddresses] = await Promise.all([
      this.getChefPoolAddresses(),
      // this.getChefV2PoolAddresses(),
    ]);

    const a = uniq([...chefPoolAddresses]);
    return a;
  }
}
