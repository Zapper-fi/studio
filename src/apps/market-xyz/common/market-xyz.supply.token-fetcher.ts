import { Inject } from '@nestjs/common';
import { BigNumberish, BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RariFuseSupplyTokenFetcher } from '~apps/rari-fuse/common/rari-fuse.supply.token-fetcher';

import { MarketXyzContractFactory, MarketXyzPoolDirectory, MarketXyzPoolLens } from '../contracts';
import { MarketXyzComptroller } from '../contracts/ethers/MarketXyzComptroller';
import { MarketXyzToken } from '../contracts/ethers/MarketXyzToken';

export abstract class MarketXyzSupplyTokenFetcher extends RariFuseSupplyTokenFetcher<
  MarketXyzPoolDirectory,
  MarketXyzComptroller,
  MarketXyzToken,
  MarketXyzPoolLens
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MarketXyzContractFactory) protected readonly contractFactory: MarketXyzContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolDirectoryContract(address: string): MarketXyzPoolDirectory {
    return this.contractFactory.marketXyzPoolDirectory({ address, network: this.network });
  }

  getComptrollerContract(address: string): MarketXyzComptroller {
    return this.contractFactory.marketXyzComptroller({ address, network: this.network });
  }

  getTokenContract(address: string): MarketXyzToken {
    return this.contractFactory.marketXyzToken({ address, network: this.network });
  }

  getLensContract(address: string): MarketXyzPoolLens {
    return this.contractFactory.marketXyzPoolLens({ address, network: this.network });
  }

  getPools(contract: MarketXyzPoolDirectory): Promise<{ name: string; comptroller: string }[]> {
    return contract.getAllPools();
  }

  getMarketTokenAddresses(contract: MarketXyzComptroller): Promise<string[]> {
    return contract.getAllMarkets();
  }

  getUnderlyingTokenAddress(contract: MarketXyzToken): Promise<string> {
    return contract.underlying();
  }

  getExchangeRateCurrent(contract: MarketXyzToken): Promise<BigNumberish> {
    return contract.exchangeRateCurrent();
  }

  getSupplyRateRaw(contract: MarketXyzToken): Promise<BigNumberish> {
    return contract.supplyRatePerBlock();
  }

  getPoolsBySupplier(address: string, contract: MarketXyzPoolLens): Promise<[BigNumber[], { comptroller: string }[]]> {
    return contract.getPoolsBySupplier(address);
  }
}
