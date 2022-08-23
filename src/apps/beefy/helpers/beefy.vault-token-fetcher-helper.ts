import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import { BigNumber } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyContractFactory } from '../contracts';

type BeefyMarketResponse = {
  id: string;
  name: string;
  token: string;
  tokenAddress?: string;
  earnedTokenAddress: string;
  earnContractAddress: string;
  network: string;
};

const NETWORK_NAME: Partial<Record<Network, string>> = {
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'bsc',
  [Network.POLYGON_MAINNET]: 'polygon',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.AVALANCHE_MAINNET]: 'avax',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
  [Network.CELO_MAINNET]: 'celo',
  [Network.AURORA_MAINNET]: 'aurora',
};

type ApyData = Record<string, number>;

type BeefyVaultTokensParams = {
  network: Network;
  dependencies: AppGroupsDefinition[];
};

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;

const APY_URL = 'https://beefy-api.herokuapp.com/apy';
const VAULTS_URL = 'https://api.beefy.finance/vaults';

@Injectable()
export class BeefyVaultTokensHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BeefyContractFactory) private readonly contractFactory: BeefyContractFactory,
  ) {}

  private async getApys(): Promise<ApyData> {
    try {
      const { data } = await Axios.get(APY_URL);
      return data;
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  private async getVaults(network: Network): Promise<BeefyMarketResponse[]> {
    try {
      const { data } = await Axios.get<BeefyMarketResponse[]>(VAULTS_URL);
      const vaultData = data.filter(x => x.network == NETWORK_NAME[network]);
      return vaultData;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getTokenMarketData({ network, dependencies }: BeefyVaultTokensParams): Promise<AppTokenPosition[]> {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const vaultData = await this.getVaults(network);
    const apyData = await this.getApys();

    const allVaults = await Promise.all(
      vaultData.map(async market => {
        const vaultTokenAddress = market.earnContractAddress.toLowerCase();
        const vaultTokenContract = this.contractFactory.beefyVaultToken({ network, address: vaultTokenAddress });

        const tokenAddress = market.tokenAddress ? market.tokenAddress.toLowerCase() : ZERO_ADDRESS;
        const baseTokenMatch = baseTokens.find(pool => pool.address === tokenAddress);
        const appTokenMatch = appTokens.find(price => price.address === tokenAddress);
        const underlyingToken = baseTokenMatch ?? appTokenMatch;
        if (!underlyingToken) return null;

        const [ratioRaw, totalSupplyRaw, decimalsRaw] = await Promise.all([
          multicall
            .wrap(vaultTokenContract)
            .getPricePerFullShare()
            .catch(() => BigNumber.from(0)),
          multicall
            .wrap(vaultTokenContract)
            .totalSupply()
            .catch(() => BigNumber.from(0)),
          multicall.wrap(vaultTokenContract).decimals(),
        ]);

        const decimals = Number(decimalsRaw);

        // The price for 1 token in the underlying token value.
        const pricePerShare = Number(ratioRaw) / 10 ** decimals;

        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const reserve = pricePerShare * supply;
        if (pricePerShare === 0) return null;

        const liquidity = reserve * underlyingToken.price;
        const price = underlyingToken.price * pricePerShare;
        const apy = apyData[market.id] * 100;
        const underlyingTokenWithReserve = { ...underlyingToken, reserve };
        const tokens = [underlyingTokenWithReserve];
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = getImagesFromToken(underlyingToken);

        const statsItems = [
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
          { label: 'APY', value: buildPercentageDisplayItem(apy) },
        ];

        const vaultToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          network,
          appId,
          groupId,
          address: vaultTokenAddress,
          displayProps: {
            label: market.name,
            secondaryLabel,
            images,
            statsItems,
          },
          dataProps: {
            liquidity,
            apy,
            implementation: market.id,
          },
          symbol: market.token,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,
        };

        return vaultToken;
      }),
    );

    return _.compact(allVaults);
  }
}
