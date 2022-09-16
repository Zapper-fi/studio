import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { DisplayProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { HectorNetworkContractFactory } from '../contracts';

type HectorNetworkWsHecDataProps = {
  liquidity: number;
};

@PositionTemplate()
export class FantomHectorNetworkWsHecTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  HectorNetworkWsHecDataProps
> {
  groupLabel = 'Wrapped sHEC V2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x94ccf60f700146bea8ef7832820800e2dfa92eda'];
  }

  async getUnderlyingTokenAddresses(_params: GetUnderlyingTokensParams<Erc20>) {
    return '0x75bdef24285013387a47775828bec90b91ca9a5f';
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<Erc20, HectorNetworkWsHecDataProps>) {
    const underlyingToken = appToken.tokens[0];
    const underlyingTokenContract = multicall.wrap(this.contractFactory.erc20(underlyingToken));
    const reserveRaw = await underlyingTokenContract.balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve / appToken.supply;
  }

  async getDataProps({ appToken }: GetDataPropsParams<Erc20, HectorNetworkWsHecDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }

  async getLabel(_params: GetDisplayPropsParams<Erc20, HectorNetworkWsHecDataProps>): Promise<DisplayProps['label']> {
    return 'Wrapped sHEC';
  }
}
