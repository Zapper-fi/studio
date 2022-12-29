import { Inject, Logger } from '@nestjs/common';
import { utils } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MidasContractFactory } from '../contracts';
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
  ) {}

  logger = new Logger(BinanceSmartChainMidasPoolTokenFetcher.name);

  async getPositions() {
    try {
      const poolDirectoryContract = this.midasContractFactory.midasPoolDirectory({
        address: poolDirectoryAddress,
        network,
      });
      const poolLensContract = this.midasContractFactory.midasPoolLens({
        address: poolLensAddress,
        network,
      });

      const [poolIndexes, pools] = await poolDirectoryContract.callStatic.getActivePools();

      if (!pools.length || !poolIndexes.length) {
        return [];
      }

      const tokens = await Promise.all(
        poolIndexes.map(async poolId => {
          const { comptroller, name } = await poolDirectoryContract.callStatic.pools(Number(poolId));

          let supply = 0;

          const assets = await poolLensContract.callStatic.getPoolAssetsWithData(comptroller);

          assets.map(value => {
            if (value.totalSupply) {
              supply += Number(utils.formatUnits(value.totalSupply, value.underlyingDecimals));
            }
          });

          const token: AppTokenPosition = {
            type: ContractType.APP_TOKEN,
            supply,
            address: comptroller,
            network,
            price: 0,
            symbol: '',
            decimals: 0,
            tokens: [],
            dataProps: {},
            displayProps: {
              label: name,
              images: [],
            },
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
