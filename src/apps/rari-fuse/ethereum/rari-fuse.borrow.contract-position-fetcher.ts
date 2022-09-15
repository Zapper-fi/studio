import { Inject } from '@nestjs/common';
import { BigNumberish, BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RariFuseBorrowContractPositionFetcher } from '../common/rari-fuse.borrow.contract-position-fetcher';
import {
  RariFuseComptroller,
  RariFuseContractFactory,
  RariFusePoolLens,
  RariFusePoolsDirectory,
  RariFuseToken,
} from '../contracts';

@PositionTemplate()
export class EthereumRariFuseBorrowContractPositionFetcher extends RariFuseBorrowContractPositionFetcher<
  RariFusePoolsDirectory,
  RariFuseComptroller,
  RariFuseToken,
  RariFusePoolLens
> {
  groupLabel = 'Lending';

  poolDirectoryAddress = '0x835482fe0532f169024d5e9410199369aad5c77e';
  lensAddress = '0x8da38681826f4abbe089643d2b3fe4c6e4730493';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RariFuseContractFactory) protected readonly contractFactory: RariFuseContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolDirectoryContract(address: string): RariFusePoolsDirectory {
    return this.contractFactory.rariFusePoolsDirectory({ address, network: this.network });
  }

  getComptrollerContract(address: string): RariFuseComptroller {
    return this.contractFactory.rariFuseComptroller({ address, network: this.network });
  }

  getTokenContract(address: string): RariFuseToken {
    return this.contractFactory.rariFuseToken({ address, network: this.network });
  }

  getLensContract(address: string): RariFusePoolLens {
    return this.contractFactory.rariFusePoolLens({ address, network: this.network });
  }

  getPools(contract: RariFusePoolsDirectory): Promise<{ name: string; comptroller: string }[]> {
    return contract.getAllPools();
  }

  getMarketTokenAddresses(contract: RariFuseComptroller): Promise<string[]> {
    return contract.getAllMarkets();
  }

  getUnderlyingTokenAddress(contract: RariFuseToken): Promise<string> {
    return contract.underlying();
  }

  getBorrowRateRaw(contract: RariFuseToken): Promise<BigNumberish> {
    return contract.borrowRatePerBlock();
  }

  getTotalBorrows(contract: RariFuseToken): Promise<BigNumberish> {
    return contract.totalBorrows();
  }

  getBorrowBalance(address: string, contract: RariFuseToken): Promise<BigNumberish> {
    return contract.borrowBalanceCurrent(address);
  }

  getPoolsBySupplier(address: string, contract: RariFusePoolLens): Promise<[BigNumber[], { comptroller: string }[]]> {
    return contract.getPoolsBySupplier(address);
  }
}
