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
export class BinanceSmartChainOokiLendTokenFetcher extends AppTokenTemplatePositionFetcher<OokiIToken> {
  groupLabel = 'Lending';

  tokenRegistryAddress = '0x1be70f29d30bb1d325e5d76ee73109de3e50a57d';

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

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<OokiIToken>) {
    return [{ address: await contract.loanTokenAddress(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<OokiIToken>) {
    const exchangeRateRaw = await contract.tokenPrice();
    const exchangeRate = Number(exchangeRateRaw) / 10 ** 18;
    return [exchangeRate];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<OokiIToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<OokiIToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<OokiIToken>) {
    return 0;
  }
}
