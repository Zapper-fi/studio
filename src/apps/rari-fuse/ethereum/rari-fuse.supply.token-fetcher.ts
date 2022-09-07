import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { RariFuseSupplyTokenFetcher } from '../common/rari-fuse.supply.token-fetcher';
import {
  RariFuseComptroller,
  RariFuseContractFactory,
  RariFusePoolLens,
  RariFusePoolsDirectory,
  RariFuseToken,
} from '../contracts';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Injectable()
export class EthereumRariFuseSupplyTokenFetcher extends RariFuseSupplyTokenFetcher<
  RariFusePoolsDirectory,
  RariFuseComptroller,
  RariFuseToken,
  RariFusePoolLens
> {
  appId = RARI_FUSE_DEFINITION.id;
  groupId = RARI_FUSE_DEFINITION.groups.supply.id;
  network = Network.ETHEREUM_MAINNET;
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

  getExchangeRateCurrent(contract: RariFuseToken): Promise<BigNumberish> {
    return contract.exchangeRateCurrent();
  }

  getSupplyRateRaw(contract: RariFuseToken): Promise<BigNumberish> {
    return contract.supplyRatePerBlock();
  }

  getPoolsBySupplier(address: string, contract: RariFusePoolLens) {
    return contract.getPoolsBySupplier(address);
  }
}
