import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RariFuseBorrowContractPositionFetcher } from '~apps/rari-fuse/common/rari-fuse.borrow.contract-position-fetcher';

import { MarketXyzViemContractFactory } from '../contracts';
import { MarketXyzPoolDirectory, MarketXyzComptroller, MarketXyzToken, MarketXyzPoolLens } from '../contracts/viem';
import { MarketXyzComptrollerContract } from '../contracts/viem/MarketXyzComptroller';
import { MarketXyzPoolDirectoryContract } from '../contracts/viem/MarketXyzPoolDirectory';
import { MarketXyzPoolLensContract } from '../contracts/viem/MarketXyzPoolLens';
import { MarketXyzTokenContract } from '../contracts/viem/MarketXyzToken';

export abstract class MarketXyzBorrowContractPositionFetcher extends RariFuseBorrowContractPositionFetcher<
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
    return contract.read.getAllPools().then(v => v.map(pool => ({ name: pool.name, comptroller: pool.comptroller })));
  }

  getMarketTokenAddresses(contract: MarketXyzComptrollerContract): Promise<string[]> {
    return contract.read.getAllMarkets().then(v => v.map(market => market));
  }

  getUnderlyingTokenAddress(contract: MarketXyzTokenContract): Promise<string> {
    return contract.read.underlying();
  }

  getBorrowRateRaw(contract: MarketXyzTokenContract): Promise<BigNumberish> {
    return contract.read.borrowRatePerBlock();
  }

  getTotalBorrows(contract: MarketXyzTokenContract): Promise<BigNumberish> {
    return contract.read.totalBorrows();
  }

  getBorrowBalance(address: string, contract: MarketXyzTokenContract): Promise<BigNumberish> {
    return contract.read.borrowBalanceCurrent([address]);
  }

  async getPoolsBySupplier(
    address: string,
    contract: MarketXyzPoolLensContract,
  ): Promise<[BigNumberish[], { comptroller: string }[]]> {
    return contract.read
      .getPoolsBySupplier([address])
      .then(([pools, comptrollers]) => [[...pools], comptrollers.map(c => ({ comptroller: c.comptroller }))]);
  }
}
