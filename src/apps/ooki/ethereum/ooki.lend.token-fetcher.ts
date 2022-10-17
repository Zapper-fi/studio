import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { OokiContractFactory, OokiIToken } from '../contracts';

@PositionTemplate()
export class EthereumOokiLendTokenFetcher extends AppTokenTemplatePositionFetcher<OokiIToken> {
  groupLabel = 'Lending';

  tokenRegistryAddress = '0xf0e474592b455579fe580d610b846bdbb529c6f7';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OokiContractFactory) protected readonly contractFactory: OokiContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): OokiIToken {
    return this.contractFactory.ookiIToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    const registryContract = this.contractFactory.ookiTokenRegistry({
      network: this.network,
      address: this.tokenRegistryAddress,
    });

    const tokenAddresses = await registryContract.getTokens(0, 100);
    return tokenAddresses.map(v => v.token);
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<OokiIToken>) {
    return contract.loanTokenAddress();
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<OokiIToken>) {
    const exchangeRateRaw = await contract.tokenPrice();
    return Number(exchangeRateRaw) / 10 ** 18;
  }

  getLiquidity({ appToken }: GetDataPropsParams<OokiIToken>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<OokiIToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  getApy(_params: GetDataPropsParams<OokiIToken>) {
    return 0;
  }
}
