import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MidasMarketTokenFetcher } from '../common/midas.market.token-fetcher';
import { MidasContractFactory, MidasCErc20Token, MidasPoolDirectory, MidasPoolLens } from '../contracts';
import { FusePoolDirectory } from '../contracts/ethers/MidasPoolDirectory';

@PositionTemplate()
export class BinanceSmartChainMidasMarketTokenFetcher extends MidasMarketTokenFetcher<
  MidasPoolDirectory,
  MidasCErc20Token,
  MidasPoolLens
> {
  groupLabel = 'Lending';

  poolDirectoryAddress = '0x295d7347606f4bd810c8296bb8d75d657001fcf7';
  poolLensAddress = '0x6f4e0b5405f3751f7327cf8095004c34fc307f55';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MidasContractFactory) protected readonly midasContractFactory: MidasContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolDirectoryContract(address: string): MidasPoolDirectory {
    return this.midasContractFactory.midasPoolDirectory({ address, network: this.network });
  }

  getCTokenContract(address: string): MidasCErc20Token {
    return this.midasContractFactory.midasCErc20Token({ address, network: this.network });
  }

  getPoolLensContract(address: string): MidasPoolLens {
    return this.midasContractFactory.midasPoolLens({ address, network: this.network });
  }

  getPools(contract: MidasPoolDirectory): Promise<[BigNumber[], FusePoolDirectory.FusePoolStructOutput[]]> {
    return contract.callStatic.getActivePools();
  }

  getPool(
    contract: MidasPoolDirectory,
    poolId: BigNumberish,
  ): Promise<
    [string, string, string, BigNumber, BigNumber] & {
      name: string;
      creator: string;
      comptroller: string;
      blockPosted: BigNumber;
      timestampPosted: BigNumber;
    }
  > {
    return contract.callStatic.pools(poolId);
  }

  async getMarketTokenAddresses(contract: MidasPoolLens, poolAddress: string): Promise<string[]> {
    const assets = await contract.callStatic.getPoolAssetsWithData(poolAddress);

    return assets.map(asset => asset.cToken);
  }

  getUnderlyingTokenAddress(contract: MidasCErc20Token): Promise<string> {
    return contract.underlying();
  }

  getExchangeRateCurrent(contract: MidasCErc20Token): Promise<BigNumberish> {
    return contract.callStatic.exchangeRateCurrent();
  }

  getSupplyRateRaw(contract: MidasCErc20Token): Promise<BigNumberish> {
    return contract.supplyRatePerBlock();
  }
}
