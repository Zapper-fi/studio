import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetPriceParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { SynthetixContractFactory, SynthetixSynthToken } from '../contracts';

type SynthetixSynthDataProps = DefaultAppTokenDataProps & {
  exchangeable: boolean;
};

@Injectable()
export abstract class SynthetixSynthTokenFetcher extends AppTokenTemplatePositionFetcher<
  SynthetixSynthToken,
  SynthetixSynthDataProps
> {
  abstract resolverAddress: string;
  abstract sUSDAddress: string;
  abstract isExchangeable: boolean;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixSynthToken {
    return this.contractFactory.synthetixSynthToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    const addressResolverContract = this.contractFactory.synthetixAddressResolver({
      address: this.resolverAddress,
      network: this.network,
    });

    const synthUtilName = ethers.utils.formatBytes32String('SynthUtil');
    const synthUtilAddress = await addressResolverContract.getAddress(synthUtilName);
    const snxUtilsContract = this.contractFactory.synthetixSummaryUtil({
      address: synthUtilAddress,
      network: this.network,
    });

    const synthRates = await snxUtilsContract.synthsRates();
    const synthSymbolBytes = synthRates[0];

    const addresses = await Promise.all(
      synthSymbolBytes.map(async byte => {
        const implAddressRaw = await multicall.wrap(addressResolverContract).getSynth(byte);
        const implAddress = implAddressRaw.toLowerCase();
        const implContract = this.contractFactory.synthetixNetworkToken({
          address: implAddress,
          network: this.network,
        });

        const addressRaw = await multicall.wrap(implContract).proxy();
        return addressRaw.toLowerCase();
      }),
    );

    return addresses;
  }

  async getUnderlyingTokenDefinitions() {
    return [];
  }

  async getPricePerShare() {
    return [1];
  }

  async getPrice({
    appToken,
    contract,
    multicall,
    tokenLoader,
  }: GetPriceParams<SynthetixSynthToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<number> {
    const sUSDToken = await tokenLoader.getOne({ address: this.sUSDAddress, network: this.network });
    const addressResolverContract = this.contractFactory.synthetixAddressResolver({
      address: this.resolverAddress,
      network: this.network,
    });

    const synthExchangeRatesName = ethers.utils.formatBytes32String('ExchangeRates');
    const synthExchangeRatesAddress = await addressResolverContract.getAddress(synthExchangeRatesName);
    const synthExchangeRatesContract = this.contractFactory.synthetixExchangeRates({
      address: synthExchangeRatesAddress,
      network: this.network,
    });

    const key = await contract.currencyKey();
    const rate = await multicall.wrap(synthExchangeRatesContract).rateForCurrency(key);
    const price = (Number(rate) * sUSDToken!.price) / 10 ** appToken.decimals;
    return price;
  }

  async getReserves() {
    return [0];
  }

  async getDataProps(params: GetDataPropsParams<SynthetixSynthToken>) {
    const defaultDataProps = await super.getDataProps(params);
    return { ...defaultDataProps, exchangeable: this.isExchangeable };
  }

  async getImages({ appToken }: GetDisplayPropsParams<SynthetixSynthToken>) {
    return [getAppAssetImage(this.appId, appToken.symbol)];
  }
}
