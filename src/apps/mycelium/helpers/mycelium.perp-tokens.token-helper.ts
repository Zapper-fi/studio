import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { MyceliumContractFactory } from '../contracts';
import MYCELIUM_DEFINITION from '../mycelium.definition';

import { MyceliumApiHelper } from './mycelium.api.helper';
import { MyceliumPoolPrices, MyceliumPoolsApiDatas } from './mycelium.interface';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.perpTokens.id;
const network = Network.ARBITRUM_MAINNET;

const extractUnderlyingNameFromPoolName = (name: string): string => {
  const splitted = name.split('/');
  const levTokenStringSplitted = splitted[0].split('-');
  return levTokenStringSplitted.length > 2 ? levTokenStringSplitted[2] : levTokenStringSplitted[1];
};

@Injectable()
export class MyceliumPerpTokensHelper {
  constructor(
    @Inject(MyceliumContractFactory) private readonly myceliumContractFactory: MyceliumContractFactory,
    @Inject(MyceliumApiHelper) private readonly myceliumApiHelper: MyceliumApiHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getMyceliumPoolTokens(
    { name, shortToken, longToken, settlementToken }: MyceliumPoolsApiDatas,
    poolPrices: MyceliumPoolPrices,
  ) {
    try {
      const extractedUnderlyingSymbol = extractUnderlyingNameFromPoolName(name);
      const multicall = this.appToolkit.getMulticall(network);

      const settlementTokenContract = this.appToolkit.globalContracts.erc20({
        address: settlementToken.address,
        network,
      });
      const shortTokenContract = this.myceliumContractFactory.myceliumPerpToken({
        address: shortToken.address,
        network,
      });
      const longTokenContract = this.myceliumContractFactory.myceliumPerpToken({
        address: longToken.address,
        network,
      });

      const [shortSupplyRaw, longSupplyRaw, settlementTokenSymbol] = await Promise.all([
        multicall.wrap(shortTokenContract).totalSupply(),
        multicall.wrap(longTokenContract).totalSupply(),
        multicall.wrap(settlementTokenContract).symbol(),
      ]);

      const shortSupply = Number(shortSupplyRaw) / 10 ** shortToken.decimals;
      const longSupply = Number(longSupplyRaw) / 10 ** longToken.decimals;

      const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
      const underlyingToken = baseTokenDependencies.find(v => v.symbol === extractedUnderlyingSymbol);

      if (!underlyingToken) return [];

      const tokens = [];
      const pricePerShare = 0;
      const images = getImagesFromToken(underlyingToken);

      const short: AppTokenPosition = {
        type: ContractType.APP_TOKEN,
        appId,
        groupId,
        network,
        pricePerShare,
        tokens,
        supply: shortSupply,
        symbol: shortToken.symbol,
        address: shortToken.address,
        decimals: shortToken.decimals,
        price: poolPrices.shortTokenPrice,
        dataProps: {
          liquidity: shortSupply * poolPrices.shortTokenPrice,
        },
        displayProps: {
          label: shortToken.symbol,
          images,
          secondaryLabel: buildDollarDisplayItem(poolPrices.shortTokenPrice),
          statsItems: [
            {
              label: 'Liquidity',
              value: buildDollarDisplayItem(shortSupply * poolPrices.shortTokenPrice),
            },
            {
              label: 'Settlement token',
              value: settlementTokenSymbol,
            },
          ],
        },
      };
      const long: AppTokenPosition = {
        type: ContractType.APP_TOKEN,
        appId,
        groupId,
        network,
        pricePerShare,
        tokens,
        supply: longSupply,
        symbol: longToken.symbol,
        address: longToken.address,
        decimals: longToken.decimals,
        price: poolPrices.longTokenPrice,
        dataProps: {
          liquidity: longSupply * poolPrices.longTokenPrice,
        },
        displayProps: {
          label: longToken.symbol,
          images,
          secondaryLabel: buildDollarDisplayItem(poolPrices.longTokenPrice),
          statsItems: [
            {
              label: 'Liquidity',
              value: buildDollarDisplayItem(longSupply * poolPrices.longTokenPrice),
            },
            {
              label: 'Settlement token',
              value: settlementTokenSymbol,
            },
          ],
        },
      };

      return [long, short];
    } catch (err) {
      return [];
    }
  }

  async getTokens() {
    const rawPools = await this.myceliumApiHelper.getMyceliumPools();
    let appPoolTokens: Array<AppTokenPosition> = [];
    await Promise.all(
      rawPools.map(async (rawPool): Promise<Array<AppTokenPosition>> => {
        const poolPrices = await this.myceliumApiHelper.getMyceliumPoolTokensPrices(rawPool.address);
        const poolTokens = await this.getMyceliumPoolTokens(rawPool, poolPrices);
        appPoolTokens = [...appPoolTokens, ...poolTokens];
        return appPoolTokens;
      }),
    );
    return appPoolTokens;
  }
}
