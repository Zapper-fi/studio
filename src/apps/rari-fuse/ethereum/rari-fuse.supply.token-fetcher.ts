import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { RawTokenBalance } from '~position/position-balance.interface';

import { RariFuseSupplyTokenDataProps, RariFuseSupplyTokenFetcher } from '../common/rari-fuse.supply.token-fetcher';
import { RariFuseViemContractFactory } from '../contracts';
import { RariFuseComptroller, RariFusePoolLens, RariFusePoolsDirectory, RariFuseToken } from '../contracts/viem';
import { RariFuseComptrollerContract } from '../contracts/viem/RariFuseComptroller';
import { RariFusePoolLensContract } from '../contracts/viem/RariFusePoolLens';
import { RariFusePoolsDirectoryContract } from '../contracts/viem/RariFusePoolsDirectory';
import { RariFuseTokenContract } from '../contracts/viem/RariFuseToken';

@PositionTemplate()
export class EthereumRariFuseSupplyTokenFetcher extends RariFuseSupplyTokenFetcher<
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
    @Inject(RariFuseViemContractFactory) protected readonly contractFactory: RariFuseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolDirectoryContract(address: string): RariFusePoolsDirectoryContract {
    return this.contractFactory.rariFusePoolsDirectory({ address, network: this.network });
  }

  getComptrollerContract(address: string): RariFuseComptrollerContract {
    return this.contractFactory.rariFuseComptroller({ address, network: this.network });
  }

  getTokenContract(address: string): RariFuseTokenContract {
    return this.contractFactory.rariFuseToken({ address, network: this.network });
  }

  getLensContract(address: string): RariFusePoolLensContract {
    return this.contractFactory.rariFusePoolLens({ address, network: this.network });
  }

  getPools(contract: RariFusePoolsDirectoryContract): Promise<{ name: string; comptroller: string }[]> {
    return contract.read.getAllPools().then(v => [...v]);
  }

  getMarketTokenAddresses(contract: RariFuseComptrollerContract): Promise<string[]> {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  getUnderlyingTokenAddress(contract: RariFuseTokenContract): Promise<string> {
    return contract.read.underlying();
  }

  getExchangeRateCurrent(contract: RariFuseTokenContract): Promise<BigNumberish> {
    return contract.read.exchangeRateCurrent();
  }

  getSupplyRateRaw(contract: RariFuseTokenContract): Promise<BigNumberish> {
    return contract.read.supplyRatePerBlock();
  }

  async getRawBalances(address: string): Promise<RawTokenBalance[]> {
    const lens = this.getLensContract(this.lensAddress);
    const [, comptrollers] = await lens.read.getPoolsBySupplier([address]);
    const participatedComptrollers = comptrollers.map(t => t.comptroller.toLowerCase());

    const multicall = this.appToolkit.getViemMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<RariFuseSupplyTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return Promise.all(
      appTokens
        .filter(v => participatedComptrollers.includes(v.dataProps.comptroller))
        .map(async appToken => {
          const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
          return { key: this.appToolkit.getPositionKey(appToken), balance: balanceRaw.toString() };
        }),
    );
  }
}
