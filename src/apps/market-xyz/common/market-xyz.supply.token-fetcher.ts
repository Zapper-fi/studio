import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RariFuseSupplyTokenFetcher } from '~apps/rari-fuse/common/rari-fuse.supply.token-fetcher';

import { MarketXyzViemContractFactory } from '../contracts';
import { MarketXyzPoolDirectory, MarketXyzComptroller, MarketXyzToken, MarketXyzPoolLens } from '../contracts/viem';
import { MarketXyzComptrollerContract } from '../contracts/viem/MarketXyzComptroller';
import { MarketXyzPoolDirectoryContract } from '../contracts/viem/MarketXyzPoolDirectory';
import { MarketXyzPoolLensContract } from '../contracts/viem/MarketXyzPoolLens';
import { MarketXyzTokenContract } from '../contracts/viem/MarketXyzToken';

export abstract class MarketXyzSupplyTokenFetcher extends RariFuseSupplyTokenFetcher<
  MarketXyzPoolDirectory,
  MarketXyzComptroller,
  MarketXyzToken,
  MarketXyzPoolLens
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MarketXyzViemContractFactory) protected readonly contractFactory: MarketXyzViemContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolDirectoryContract(address: string): MarketXyzPoolDirectoryContract {
    return this.contractFactory.marketXyzPoolDirectory({ address, network: this.network });
  }

  getComptrollerContract(address: string): MarketXyzComptrollerContract {
    return this.contractFactory.marketXyzComptroller({ address, network: this.network });
  }

  getTokenContract(address: string): MarketXyzTokenContract {
    return this.contractFactory.marketXyzToken({ address, network: this.network });
  }

  getLensContract(address: string): MarketXyzPoolLensContract {
    return this.contractFactory.marketXyzPoolLens({ address, network: this.network });
  }

  getPools(contract: MarketXyzPoolDirectoryContract): Promise<{ name: string; comptroller: string }[]> {
    return contract.read.getAllPools().then(pools => pools.map(p => ({ name: p.name, comptroller: p.comptroller })));
  }

  getMarketTokenAddresses(contract: MarketXyzComptrollerContract): Promise<string[]> {
    return contract.read.getAllMarkets().then(v => v.map(market => market));
  }

  getUnderlyingTokenAddress(contract: MarketXyzTokenContract): Promise<string> {
    return contract.read.underlying();
  }

  getExchangeRateCurrent(contract: MarketXyzTokenContract): Promise<BigNumberish> {
    return contract.read.exchangeRateCurrent();
  }

  getSupplyRateRaw(contract: MarketXyzTokenContract): Promise<BigNumberish> {
    return contract.read.supplyRatePerBlock();
  }

  async getPoolsBySupplier(
    address: string,
    contract: MarketXyzPoolLensContract,
  ): Promise<[BigNumberish[], { comptroller: string }[]]> {
    const [pools, comptrollers] = await contract.read.getPoolsBySupplier([address]);
    return [[...pools], comptrollers.map(c => ({ comptroller: c.comptroller }))];
  }
}
