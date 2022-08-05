import { Inject } from '@nestjs/common';
import { print } from 'graphql';
import Axios from "axios";
import _, { compact } from "lodash";

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network, NETWORK_IDS } from '~types';

import { CLEARPOOL_DEFINITION } from '../clearpool.definition';
import { ClearpoolContractFactory } from '../contracts';

const appId = CLEARPOOL_DEFINITION.id;
const groupId = CLEARPOOL_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;
const networkId = NETWORK_IDS.polygon;

export type ClearpoolPoolTokenDataProps = {
  liquidity: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonClearpoolPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ClearpoolContractFactory) private readonly clearpoolContractFactory: ClearpoolContractFactory,
  ) { }

  async getPositions() {
    // Retrieve pool addresses from the Clearpool API
    const endpoint = `https://api-v3.clearpool.finance/${networkId}/pools`;
    const data = await Axios.get(endpoint).then(
      (v) => v.data
    );
    const poolAddresses = data.map(({ address }) =>
      address.toLowerCase()
    );

    // Create a multicall wrapper instance to batch chain RPC calls together
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    // Get a token object for each pool address
    const tokens = await Promise.all(
      poolAddresses.map(async (poolAddress) => {
        // Instantiate a contract instance pointing to the pool address
        const contract = this.clearpoolContractFactory.clearpoolPool({
          address: poolAddress,
          network,
        });

        // Query details from the pool contract
        const [name, symbol, decimals, totalSupplyRaw, currentExchangeRateRaw, currencyRaw, poolSizeRaw] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).getCurrentExchangeRate(),
          multicall.wrap(contract).currency(),
          multicall.wrap(contract).poolSize(),
        ]);

        // Get the underlying token of the pool
        const underlyingToken = baseTokens.find(p => p.address == currencyRaw.toLowerCase());
        if (!underlyingToken) return null;

        // Data props
        const address = poolAddress;
        const supply = Number(totalSupplyRaw) / 10 ** 6;
        const pricePerShare = 1;
        const price = Number(currentExchangeRateRaw) / 10 ** 18;
        const tokens = [underlyingToken];
        const liquidity = Number(poolSizeRaw) / 10 ** 6;
        if (liquidity <= 0) return null;

        // Display props
        const label = name;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getTokenImg(underlyingToken.address, network)];
        const statsItems = [
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        // Create the token object
        const token: AppTokenPosition<ClearpoolPoolTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply,
          pricePerShare,
          price,
          tokens,

          dataProps: {
            liquidity
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return token;
      })
    );

    return compact(tokens);
  }
}
