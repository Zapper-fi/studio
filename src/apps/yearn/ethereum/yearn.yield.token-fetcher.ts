import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YearnContractFactory } from '../contracts';
import { YEARN_DEFINITION } from '../yearn.definition';

import { Y_TOKENS } from './yearn.yield.token-definitions';

type YearnYieldTokenDataProps = {
  liquidity: number;
  reserve: number;
};

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.yield.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumYearnYieldTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory)
    private readonly yearnContractFactory: YearnContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      Y_TOKENS.map(async yToken => {
        const underlyingToken = baseTokens.find(t => t.address === yToken.underlyingAddress);
        if (!underlyingToken) return null;

        const contract = this.yearnContractFactory.yearnVault({ address: yToken.address, network });

        const [symbol, decimals, supplyRaw, pricePerShareRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall
            .wrap(contract)
            .getPricePerFullShare()
            .catch(() => 0),
        ]);

        const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const reserve = supply * pricePerShare;
        const liquidity = reserve * underlyingToken.price;
        const price = liquidity / supply;
        const tokens = [underlyingToken];

        // Display Props
        const label = symbol;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getTokenImg(underlyingToken.address, network)];
        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const yieldToken: AppTokenPosition<YearnYieldTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: yToken.address,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
            reserve,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return yieldToken;
      }),
    );

    return compact(tokens);
  }
}
