import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { isEmpty, isUndefined } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { KoyoContractFactory } from '../contracts';

export enum KoyoPoolLabelStrategy {
  TOKEN_SYMBOLS = 'token-symbols',
  POOL_NAME = 'pool-name',
}

type KoyoPoolTokenDataProps = {
  liquidity: number;
  fee: number;
  reserves: number[];
  weights: number[];
  volume: number;
};

type GetKoyoPoolTokensParams = {
  network: Network;
  appId: string;
  groupId: string;
  appTokenDependencies?: AppGroupsDefinition[];
  vaultAddress: string;
  minLiquidity?: number;
  resolvePoolTokenAddresses: (opts: {
    appId: string;
    network: Network;
  }) => Promise<{ address: string; volume: number }[]>;
  resolvePoolLabelStrategy?: () => KoyoPoolLabelStrategy;
};

@Injectable()
export class KoyoPoolTokensHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(KoyoContractFactory) private readonly contractFactory: KoyoContractFactory,
  ) {}

  async getTokenMarketData({
    network,
    appId,
    groupId,
    appTokenDependencies = [],
    vaultAddress,
    minLiquidity = 0,
    resolvePoolTokenAddresses,
    resolvePoolLabelStrategy = () => KoyoPoolLabelStrategy.TOKEN_SYMBOLS,
  }: GetKoyoPoolTokensParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...appTokenDependencies);
    const poolTokenData = await resolvePoolTokenAddresses({ appId, network });
    const vaultContract = this.contractFactory.koyoVault({ network, address: vaultAddress });

    const pools = await Promise.all(
      poolTokenData.map(async ({ address, volume }) => {
        const type = ContractType.APP_TOKEN;
        const poolContract = this.contractFactory.koyoPool({ network, address });
        const poolId = await multicall.wrap(poolContract).getPoolId();

        // Resolve underlying tokens
        const poolTokensRaw = await multicall.wrap(vaultContract).getPoolTokens(poolId);
        const tokenAddresses = poolTokensRaw.tokens.map(v => v.toLowerCase());
        const tokensRaw = tokenAddresses.map(tokenAddress => {
          const baseToken = prices.find(price => price.address === tokenAddress);
          const appToken = appTokens.find(p => p.address === tokenAddress);
          return appToken ?? baseToken;
        });

        if (tokensRaw.some(isUndefined)) return null;
        const tokens = _.compact(tokensRaw);

        const reserves = tokens.map((t, i) => Number(poolTokensRaw.balances[i]) / 10 ** t.decimals);
        const liquidity = tokens.reduce((acc, v, i) => acc + v.price * reserves[i], 0);
        if (liquidity < minLiquidity) return null;

        const [decimals, supplyRaw, symbol, feeRaw, weightsRaw] = await Promise.all([
          multicall.wrap(poolContract).decimals(),
          multicall.wrap(poolContract).totalSupply(),
          multicall.wrap(poolContract).symbol(),
          multicall
            .wrap(poolContract)
            .getSwapFeePercentage()
            .catch(() => '100000000000000000'),
          multicall
            .wrap(poolContract)
            .getNormalizedWeights()
            .catch(() => []),
        ]);
        // Data Props
        const supply = Number(supplyRaw) / 10 ** decimals;
        const fee = Number(feeRaw) / 10 ** 18;
        const price = liquidity / supply;
        const pricePerShare = reserves.map(r => r / supply);
        const reservePercentages = tokens.map((t, i) => reserves[i] * (t.price / liquidity));
        const weights = tokens.map((_, i) =>
          isEmpty(weightsRaw) ? 1 / tokens.length : Number(weightsRaw[i]) / 10 ** 18,
        );

        // Display Props
        const labelStrategy = resolvePoolLabelStrategy();
        const label =
          labelStrategy === KoyoPoolLabelStrategy.POOL_NAME
            ? await multicall.wrap(poolContract).name()
            : tokens.map(v => v.symbol).join(' / ');
        const secondaryLabel = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
        const images = tokens.map(v => getTokenImg(v.address, network));

        const token: AppTokenPosition<KoyoPoolTokenDataProps> = {
          type,
          address,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            fee,
            liquidity,
            reserves,
            weights,
            volume,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
            ],
          },
        };

        return token;
      }),
    );

    return _.compact(pools);
  }
}
