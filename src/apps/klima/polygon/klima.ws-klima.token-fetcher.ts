import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { KlimaContractFactory, KlimaWsKlima } from '../contracts';

@PositionTemplate()
export class PolygonKlimaWsTokenFetcher extends AppTokenTemplatePositionFetcher<KlimaWsKlima> {
  groupLabel = 'wsKLIMA';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KlimaContractFactory) protected readonly contractFactory: KlimaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KlimaWsKlima {
    return this.contractFactory.klimaWsKlima({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xca76543cf381ebbb277be79574059e32108e3e65'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<KlimaWsKlima>) {
    return [await contract.sKLIMA()];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<KlimaWsKlima>) {
    const reserveRaw = await multicall.wrap(this.contractFactory.erc20(appToken.tokens[0])).balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
