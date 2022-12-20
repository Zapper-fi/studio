import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetDisplayPropsParams, GetPriceParams } from '~position/template/app-token.template.types';

import { SynthetixContractFactory, SynthetixNetworkToken } from '../contracts';

export abstract class SynthetixSnxTokenFetcher extends AppTokenTemplatePositionFetcher<SynthetixNetworkToken> {
  abstract snxAddress: string;
  abstract isExchangeable: boolean;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixNetworkToken {
    return this.contractFactory.synthetixNetworkToken({ address, network: this.network });
  }

  async getAddresses() {
    return [this.snxAddress];
  }

  async getUnderlyingTokenDefinitions() {
    return [];
  }

  async getPricePerShare() {
    return [1];
  }

  async getPrice({ appToken }: GetPriceParams<SynthetixNetworkToken>): Promise<number> {
    const baseToken = await this.appToolkit.getBaseTokenPrice({ address: appToken.address, network: this.network });
    return baseToken!.price;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<SynthetixNetworkToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves() {
    return [0];
  }

  async getApy() {
    return 0;
  }

  async getDataProps(params: GetDataPropsParams<SynthetixNetworkToken>) {
    const defaultDataProps = await super.getDataProps(params);
    return { ...defaultDataProps, exchangeable: this.isExchangeable };
  }

  async getImages({ appToken }: GetDisplayPropsParams<SynthetixNetworkToken>) {
    return [getTokenImg(appToken.address, this.network)];
  }

  async getBalancePerToken({
    address,
    appToken,
    multicall,
  }: {
    address: string;
    appToken: AppTokenPosition<DefaultDataProps>;
    multicall: IMulticallWrapper;
  }): Promise<BigNumberish> {
    return multicall.wrap(this.getContract(appToken.address)).transferableSynthetix(address);
  }
}
