import { Inject, Logger } from '@nestjs/common';
import { utils } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { MidasCErc20Delegate, MidasComptroller, MidasContractFactory } from '~apps/midas/contracts';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MidasPoolTokenHelper } from '../helpers/midas.pool.token-helper';
import { MIDAS_DEFINITION } from '../midas.definition';

const appId = MIDAS_DEFINITION.id;
const groupId = MIDAS_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;
const poolDirectoryAddress = '0x295d7347606f4bd810c8296bb8d75d657001fcf7';
const poolLensAddress = '0x7ef21f8bfa2356cc6fe43755e46e8e07d4ee8a47';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainMidasPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MidasContractFactory) private readonly midasContractFactory: MidasContractFactory,
    @Inject(MidasPoolTokenHelper) private readonly midasPoolTokenHelper: MidasPoolTokenHelper,
  ) {}

  logger = new Logger(BinanceSmartChainMidasPoolTokenFetcher.name);

  getMidasCTokenContract({ address, network }: { address: string; network: Network }) {
    return this.midasContractFactory.midasCErc20Delegate({ address, network });
  }

  getMidasComptrollerContract({ address, network }: { address: string; network: Network }) {
    return this.midasContractFactory.midasComptroller({ address, network });
  }

  getMarkets({ contract }: { contract: MidasComptroller }) {
    return contract.callStatic.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: { contract: MidasCErc20Delegate }) {
    return await contract.callStatic.underlying();
  }

  async getExchangeRate({ contract }: { contract: MidasCErc20Delegate }) {
    return await contract.callStatic.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: { contract: MidasCErc20Delegate }) {
    return contract.callStatic.supplyRatePerBlock().catch(() => 0);
  }

  async getBorrowRate({ contract }: { contract: MidasCErc20Delegate }) {
    return contract.callStatic.borrowRatePerBlock().catch(() => 0);
  }

  getExchangeRateMantissa({
    tokenDecimals,
    underlyingTokenDecimals,
  }: {
    tokenDecimals: number;
    underlyingTokenDecimals: number;
  }) {
    return tokenDecimals ?? underlyingTokenDecimals;
  }

  async getPositions() {
    try {
      const poolDirectoryContract = this.midasContractFactory.midasPoolDirectory({
        address: poolDirectoryAddress,
        network,
      });
      const allPools = await poolDirectoryContract.callStatic.getAllPools();
      const addresses: string[] = [];

      if (allPools) {
        allPools.map(pool => {
          addresses.push(pool[2]);
        });
      }

      // const tokens = await Promise.all(
      //   addresses.map(poolAddress =>
      //     this.midasPoolTokenHelper.getTokens({
      //       comptrollerAddress: poolAddress,
      //       network,
      //       appId,
      //       groupId,
      //       getComptrollerContract: this.getMidasComptrollerContract,
      //       getTokenContract: this.getMidasCTokenContract,
      //       getAllMarkets: this.getMarkets,
      //       getExchangeRate: this.getExchangeRate,
      //       getSupplyRate: this.getSupplyRate,
      //       getBorrowRate: this.getBorrowRate,
      //       getUnderlyingAddress: this.getUnderlyingAddress,
      //       getExchangeRateMantissa: this.getExchangeRateMantissa,
      //     }),
      //   ),
      // );

      // return tokens;

      const poolLensContract = this.midasContractFactory.midasPoolLens({
        address: poolLensAddress,
        network,
      });

      const tokens = await Promise.all(
        addresses.map(async poolAddress => {
          let supply = 0;

          const assets = await poolLensContract.callStatic.getPoolAssetsWithData(poolAddress);

          assets.map(value => {
            if (value.totalSupply) {
              supply += Number(utils.formatUnits(value.totalSupply, value.underlyingDecimals));
            }
          });

          const token: AppTokenPosition = {
            type: ContractType.APP_TOKEN,
            supply,
            address: poolAddress,
            network,
            price: 0,
            symbol: '',
            decimals: 0,
            tokens: [],
            dataProps: {},
            displayProps: { label: 'label', images: [] },
            appId,
            groupId,
            pricePerShare: 0,
          };

          return token;
        }),
      );

      return tokens;
    } catch (e) {
      this.logger.error(e);

      return [];
    }
  }
}
