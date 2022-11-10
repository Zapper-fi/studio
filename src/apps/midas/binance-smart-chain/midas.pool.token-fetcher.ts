import { Inject, Logger } from '@nestjs/common';
import { utils } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { MidasContractFactory } from '~apps/midas/contracts';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MIDAS_DEFINITION } from '../midas.definition';

const appId = MIDAS_DEFINITION.id;
const groupId = MIDAS_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;
const address = '0x82edcfe00bd0ce1f3ab968af09d04266bc092e0e';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainMidasPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MidasContractFactory) private readonly midasContractFactory: MidasContractFactory,
  ) {}

  logger = new Logger(BinanceSmartChainMidasPoolTokenFetcher.name);

  async getPositions() {
    try {
      const poolDirectoryContract = this.midasContractFactory.midasPoolDirectory({ address, network });
      const allPools = await poolDirectoryContract.callStatic.getAllPools();
      const addresses: string[] = [];

      this.logger.log(allPools);

      if (allPools) {
        allPools.map(pool => {
          addresses.push(pool[2]);
        });
      }

      const tokens = await Promise.all(
        addresses.map(async poolAddress => {
          const contract = this.midasContractFactory.midasPoolLens({
            address: poolAddress,
            network,
          });

          let supply = 0;

          (await contract.callStatic.getPoolAssetsWithData(poolAddress)).map(value => {
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
