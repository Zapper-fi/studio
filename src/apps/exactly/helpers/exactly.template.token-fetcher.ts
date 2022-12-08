import { Inject } from '@nestjs/common';
import { constants } from 'ethers';

import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import type { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import type { AppTokenPosition } from '~position/position.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import type { DefaultAppTokenDataProps } from '~position/template/app-token.template.types';

import { ExactlyContractFactory, Market, Previewer } from '../contracts';
import { PREVIEWER_ADDRESS } from '../ethereum/constants';

export type ExactlyTokenDataProps = DefaultAppTokenDataProps & {
  apr: number;
};

export abstract class ExactlyTemplateTokenFetcher extends AppTokenTemplatePositionFetcher<
  Market,
  ExactlyTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ExactlyContractFactory) protected readonly contractFactory: ExactlyContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const exactly = await this.appToolkit
      .getMulticall(this.network)
      .wrap(this.previewer)
      .exactly(constants.AddressZero);
    return exactly.map(({ market }) => market);
  }

  getContract(address: string) {
    return this.contractFactory.market({ address, network: this.network });
  }

  getAPY(marketAccount: Previewer.MarketAccountStructOutput) {
    return this.toAPY(this.getAPR(marketAccount));
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(this.network);
    const exactly = await multicall.wrap(this.previewer).exactly(constants.AddressZero);
    const tokens = await Promise.all(
      exactly.map(async marketAccount => {
        const { market: address, asset, decimals, assetSymbol, totalFloatingDepositAssets } = marketAccount;
        const baseUnit = 10 ** decimals;
        const market = multicall.wrap(this.contractFactory.market({ address, network: this.network }));
        const [symbol, totalSupply] = await Promise.all([market.symbol(), market.totalSupply()]);

        const baseToken = await this.appToolkit.getBaseTokenPrice({
          network: this.network,
          address: asset.toLowerCase(),
        });
        if (!baseToken) return null;

        const supply = Number(totalSupply) / baseUnit;
        const liquidity = (Number(totalFloatingDepositAssets) / baseUnit) * baseToken.price;
        const pricePerShare = Number(totalFloatingDepositAssets.mul(constants.WeiPerEther).div(totalSupply)) / baseUnit;

        return {
          type: ContractType.APP_TOKEN,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          symbol,
          address,
          decimals,
          supply,
          pricePerShare,
          price: baseToken.price * pricePerShare,
          tokens: [baseToken],
          dataProps: {
            liquidity,
            apr: this.getAPR(marketAccount),
            apy: this.getAPY(marketAccount),
            reserves: [],
          },
          displayProps: {
            label: assetSymbol,
            labelDetailed: symbol,
            images: [...getImagesFromToken(baseToken)],
          },
        };
      }),
    );
    return tokens.filter(Boolean) as AppTokenPosition<ExactlyTokenDataProps>[];
  }

  protected get previewer() {
    return this.contractFactory.previewer({ address: PREVIEWER_ADDRESS, network: this.network });
  }

  protected toAPY(apr: number, maturity?: number) {
    const year = 31_536_000;

    if (!maturity) return (1 + apr / year) ** year - 1;

    const timeLeft = maturity - Math.round(Date.now() / 1_000);
    return (1 + (apr * timeLeft) / year) ** (year / timeLeft) - 1;
  }

  abstract getAPR(marketAccount: Previewer.MarketAccountStructOutput): number;
}
