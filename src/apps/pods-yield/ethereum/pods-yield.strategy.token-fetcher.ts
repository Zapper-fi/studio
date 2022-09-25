import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PodsYieldContractFactory } from '../contracts';
import { PODS_YIELD_DEFINITION } from '../pods-yield.definition';

import { strategyAddresses, strategyDetails } from './config';

const appId = PODS_YIELD_DEFINITION.id;
const groupId = PODS_YIELD_DEFINITION.groups.strategy.id;
const network = Network.ETHEREUM_MAINNET;

export type PodsYieldStrategyDataProps = {
  liquidity: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPodsYieldStrategyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PodsYieldContractFactory) private readonly podsYieldContractFactory: PodsYieldContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      strategyAddresses.map(async strategyAddress => {
        const contract = this.podsYieldContractFactory.vault({
          address: strategyAddress,
          network,
        });

        // Find the underlying asset, usually stETH
        const [underlyingTokenAddressRaw] = await Promise.all([
          multicall
            .wrap(contract)
            .asset()
            .catch(() => ''),
        ]);

        // Get the market price of this token
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = baseTokenDependencies.find(v => v.address === underlyingTokenAddress);
        if (!underlyingToken) return null;
        const tokens = [underlyingToken];

        const [symbol, decimals, supplyRaw, assetsRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).totalAssets(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;
        const assets = Number(assetsRaw) / 10 ** decimals;

        const pricePerShare = assets / supply;
        const price = pricePerShare * underlyingToken.price;

        const details = strategyDetails[strategyAddress.toLowerCase()] || strategyDetails.standard;

        const label = details.title;
        const images = getImagesFromToken(underlyingToken);
        const secondaryLabel = buildDollarDisplayItem(price);

        const token: AppTokenPosition<PodsYieldStrategyDataProps> = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: strategyAddress,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {
            liquidity: assets,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
          },
        };

        return token;
      }),
    );

    return _.compact(tokens);
  }
}
