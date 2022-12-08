import { Inject } from '@nestjs/common';
import { constants } from 'ethers';
import type { BigNumber } from 'ethers';

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
    const marketsData = await this.previewer.exactly(constants.AddressZero);
    return marketsData.map(({ market }) => market);
  }

  getContract(address: string) {
    return this.contractFactory.market({ address, network: this.network });
  }

  abstract getAPR(marketAccount: Previewer.MarketAccountStructOutput): BigNumber;

  async getPositions() {
    const exactly = await this.previewer.exactly(constants.AddressZero);
    const multicall = this.appToolkit.getMulticall(this.network);
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

        const apr = Number(this.getAPR(marketAccount)) / 1e18;
        const apy = (1 + Number(apr) / 31_536_000) ** 31_536_000 - 1;

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
          dataProps: { liquidity, apr, apy, reserves: [] },
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

  get previewer() {
    return this.contractFactory.previewer({ address: PREVIEWER_ADDRESS, network: this.network });
  }
}
