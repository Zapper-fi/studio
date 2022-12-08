import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { DefaultAppTokenDataProps } from '~position/template/app-token.template.types';

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
    @Inject(ExactlyContractFactory) protected readonly exactlyContractFactory: ExactlyContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    const previewer = this.getPreviewer();
    const marketsData = await previewer.exactly(ZERO_ADDRESS);

    return marketsData.map(({ market }) => market);
  }

  getContract(address: string) {
    return this.exactlyContractFactory.market({
      address,
      network: this.network,
    });
  }

  abstract getAPR(marketData: Previewer.MarketAccountStructOutput): BigNumber;

  async getPositions() {
    const previewer = this.getPreviewer();

    const marketsData = await previewer.exactly(ZERO_ADDRESS);

    const multicall = this.appToolkit.getMulticall(this.network);
    const tokens = await Promise.all(
      marketsData.map(async marketData => {
        const { market: address, asset } = marketData;
        const marketContract = this.exactlyContractFactory.market({
          address,
          network: this.network,
        });

        const [symbol, decimals, totalSupply, pricePerShareRaw, totalAssets] = await Promise.all([
          multicall.wrap(marketContract).symbol(),
          multicall.wrap(marketContract).decimals(),
          multicall.wrap(marketContract).totalSupply(),
          multicall.wrap(marketContract).convertToAssets(String(10 ** marketData.decimals)),
          multicall.wrap(marketContract).totalAssets(),
        ]);

        const underlyingToken = await this.appToolkit.getBaseTokenPrice({
          network: this.network,
          address: asset.toLowerCase(),
        });
        if (!underlyingToken) return null;

        const supply = Number(totalSupply) / 10 ** decimals;
        const liquidity = (Number(totalAssets) / 10 ** decimals) * underlyingToken.price;
        const pricePerShare = Number(pricePerShareRaw) / 10 ** decimals;

        const apr = Number(formatEther(this.getAPR(marketData))) * 100;
        const apy = (1 + Number(apr) / 31_536_000) ** 31_536_000 - 1;

        const token: AppTokenPosition<ExactlyTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId: this.appId,
          groupId: this.groupId,
          address,
          network: this.network,
          symbol,
          decimals,
          supply,
          price: underlyingToken.price,
          pricePerShare,
          dataProps: {
            liquidity,
            apr,
            apy,
            reserves: [],
          },
          tokens: [underlyingToken],
          displayProps: {
            label: underlyingToken.symbol,
            labelDetailed: symbol,
            images: [...getImagesFromToken(underlyingToken)],
          },
        };

        return token;
      }),
    );

    return tokens.filter(Boolean) as AppTokenPosition<ExactlyTokenDataProps>[];
  }

  getPreviewer() {
    return this.exactlyContractFactory.previewer({
      address: PREVIEWER_ADDRESS,
      network: this.network,
    });
  }
}
