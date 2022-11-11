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
const network = Network.POLYGON_MAINNET;
const poolDirectoryAddress = '0x9a161e68ec0d5364f4d09a6080920daff6fff250';
const poolLensAddress = '0x9028cd925782703209c488a8317dbf345ea5971f';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonMidasPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MidasContractFactory) private readonly midasContractFactory: MidasContractFactory,
  ) {}

  logger = new Logger(PolygonMidasPoolTokenFetcher.name);

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

      const poolLensContract = this.midasContractFactory.midasPoolLens({
        address: poolLensAddress,
        network,
      });

      const tokens = await Promise.all(
        addresses.map(async poolAddress => {
          let supply = 0;

          (await poolLensContract.callStatic.getPoolAssetsWithData(poolAddress)).map(value => {
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
