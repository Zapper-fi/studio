import { Inject } from '@nestjs/common';
import { BigNumberish, BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RariFuseBorrowContractPositionFetcher } from '~apps/rari-fuse/common/rari-fuse.borrow.contract-position-fetcher';

import {
  MarketXyzComptroller,
  MarketXyzContractFactory,
  MarketXyzPoolDirectory,
  MarketXyzPoolLens,
  MarketXyzToken,
} from '../contracts';

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
    return contract.read.getAllPools();
  }

  getMarketTokenAddresses(contract: MarketXyzComptroller): Promise<string[]> {
    return contract.read.getAllMarkets();
  }

  getUnderlyingTokenAddress(contract: MarketXyzToken): Promise<string> {
    return contract.read.underlying();
  }

  getBorrowRateRaw(contract: MarketXyzToken): Promise<BigNumberish> {
    return contract.read.borrowRatePerBlock();
  }

  getTotalBorrows(contract: MarketXyzToken): Promise<BigNumberish> {
    return contract.read.totalBorrows();
  }

  getBorrowBalance(address: string, contract: MarketXyzToken): Promise<BigNumberish> {
    return contract.read.borrowBalanceCurrent([address]);
  }

  getPoolsBySupplier(address: string, contract: MarketXyzPoolLens): Promise<[BigNumber[], { comptroller: string }[]]> {
    return contract.read.getPoolsBySupplier([address]);
  }
}
