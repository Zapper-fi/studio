import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPriceParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { MoonrockContractFactory, MoonrockToken } from '../contracts';

@PositionTemplate()
export class EthereumMoonrockIndexTokenFetcher extends AppTokenTemplatePositionFetcher<MoonrockToken> {
  groupLabel = 'Index';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MoonrockContractFactory) protected readonly contractFactory: MoonrockContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MoonrockToken {
    return this.contractFactory.moonrockToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [
      '0x02e7ac540409d32c90bfb51114003a9e1ff0249c', // JPG
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MoonrockToken>) {
    return (await contract.getComponents()).map(address => ({ address, network: this.network }));
  }

  async getPrice({ contract, appToken }: GetPriceParams<MoonrockToken>) {
    const tokensWithLiquidityRaw = await Promise.all(
      appToken.tokens.map(async underlyingToken => {
        const balanceOfRaw = await contract.getTotalComponentRealUnits(underlyingToken.address);
        const balanceOf = Number(balanceOfRaw) / 10 ** underlyingToken.decimals;

        return {
          liquidity: balanceOf * underlyingToken.price,
          baseToken: underlyingToken,
        };
      }),
    );

    const tokensWithLiquidity = _.compact(tokensWithLiquidityRaw);
    const liquidityPerToken = tokensWithLiquidity.map(x => x.liquidity);

    return _.sum(liquidityPerToken);
  }

  async getPricePerShare() {
    return [1];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<MoonrockToken>) {
    return appToken.symbol;
  }
}
