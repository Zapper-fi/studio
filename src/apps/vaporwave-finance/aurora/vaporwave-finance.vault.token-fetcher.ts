import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import TRISOLARIS_DEFINITION from '~apps/trisolaris/trisolaris.definition';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { VaporwaveFinanceContractFactory } from '../contracts';
import { VAPORWAVE_FINANCE_DEFINITION } from '../vaporwave-finance.definition';

const appId = VAPORWAVE_FINANCE_DEFINITION.id;
const groupId = VAPORWAVE_FINANCE_DEFINITION.groups.vault.id;
const network = Network.AURORA_MAINNET;

export type VaporwaveVaultDetails = {
  id: string;
  name: string; // label
  earnContractAddress: string; // vault address
  earnedToken: string; // vault token

  oracleId: string; // NOT a proper symbol
  tokenAddress: string; // want
  tokenDecimals: number; // decimal

  pricePerFullShare: number; // ratio

  logo: string;
  status: string; // check for retired
  assets: string[];
};

export async function getRegisteredToken(
  tokenAddress: string,
  symbol: string,
  registeredTokens: (BaseToken | AppTokenPosition<DefaultDataProps>)[],
) {
  let wantToken: BaseToken | AppTokenPosition<DefaultDataProps> | undefined = undefined;

  if (tokenAddress) {
    const underlyingTokenAddress = tokenAddress.toLowerCase();
    wantToken = registeredTokens.find(p => p.address === underlyingTokenAddress);
  } else {
    const tokenSymbol = symbol;
    wantToken = registeredTokens.find(p => p.symbol === tokenSymbol);
  }

  if (!wantToken) {
    return null;
  } else {
    return wantToken;
  }
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraVaporwaveFinanceVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VaporwaveFinanceContractFactory)
    private readonly vaporwaveFinanceContractFactory: VaporwaveFinanceContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${network}:${appId}:${groupId}:vaults`,
    timeout: 15 * 60 * 1000,
  })
  async getVaults() {
    const vaultData = await Axios.get<VaporwaveVaultDetails[]>('https://api.vaporwave.farm/vaults').then(v => v.data);
    return vaultData;
  }

  @CacheOnInterval({
    key: `studio:${network}:${appId}:${groupId}:vaportokenprices`,
    timeout: 15 * 60 * 1000,
  })
  async getVTokenPrices() {
    const vtokenPrices = await Axios.get('https://api.vaporwave.farm/vaportokenprices').then(v => v.data);
    return vtokenPrices;
  }

  @CacheOnInterval({
    key: `studio:${network}:${appId}:${groupId}:apy`,
    timeout: 15 * 60 * 1000,
  })
  async getAPY() {
    const apy = await Axios.get('https://api.vaporwave.farm/apy').then(v => v.data);
    return apy;
  }

  async getPositions() {
    // http://localhost:5001/apps/vaporwave-finance/tokens?groupIds[]=vault&network=aurora
    const vaultData = await this.getVaults();
    const vtokenPrices = await this.getVTokenPrices();
    const apyData = await this.getAPY();
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: TRISOLARIS_DEFINITION.id,
      groupIds: [TRISOLARIS_DEFINITION.groups.pool.id],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];

    const tokens = await Promise.all(
      vaultData.map(async vault => {
        if (vault.status != 'active') return null;
        const vaultAddress = vault.earnContractAddress;
        const contract = this.vaporwaveFinanceContractFactory.vault({
          address: vaultAddress,
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [symbol, decimals, supplyRaw, balanceOfWant] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).balance(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;
        const wantToken = allTokens.find(v => v.address === vault.tokenAddress || v.symbol === vault.oracleId);
        if (!wantToken) return null;

        // Denormalize the price per share
        const pricePerShare = Number(vault.pricePerFullShare) / 10 ** 18;
        const price = vtokenPrices[vault.earnedToken];

        const tokens = [wantToken];
        const reserve = Number(balanceOfWant) / 10 ** vault.tokenDecimals;
        const liquidity = reserve * tokens[0].price;

        const label = getLabelFromToken(wantToken);
        const secondaryLabel = buildDollarDisplayItem(price);
        const tertiaryLabel = `${(apyData[vault.id] * 100).toFixed(3)}% APY`;
        const images = getImagesFromToken(wantToken);

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: vaultAddress,
          network,
          symbol,
          decimals,
          supply,
          pricePerShare,
          price,
          tokens,
          dataProps: {
            apy: apyData[vault.id],
            liquidity,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
            tertiaryLabel,
          },
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
