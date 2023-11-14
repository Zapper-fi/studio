import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { KlimaViemContractFactory } from '../contracts';
import { KlimaWsKlima } from '../contracts/viem';

@PositionTemplate()
export class PolygonKlimaWsKlimaTokenFetcher extends AppTokenTemplatePositionFetcher<KlimaWsKlima> {
  groupLabel = 'wsKLIMA';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KlimaViemContractFactory) protected readonly contractFactory: KlimaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.klimaWsKlima({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x6f370dba99e32a3cad959b341120db3c9e280ba6'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<KlimaWsKlima>) {
    return [{ address: await contract.read.sKLIMA(), network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<KlimaWsKlima>) {
    const reserveRaw = await multicall
      .wrap(this.appToolkit.globalViemContracts.erc20(appToken.tokens[0]))
      .read.balanceOf([appToken.address]);

    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
