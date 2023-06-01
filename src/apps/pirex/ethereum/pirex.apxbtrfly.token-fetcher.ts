import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { PirexContractFactory, ApxBtrfly } from '../contracts';

@PositionTemplate()
export class EthereumPirexApxBtrflyTokenFetcher extends AppTokenTemplatePositionFetcher<ApxBtrfly> {
  groupLabel = 'Pirex BTRFLY';

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(PirexContractFactory) private readonly pirexContractFactory: PirexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ApxBtrfly {
    return this.pirexContractFactory.apxBtrfly({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return ['0xfa35d1f603384e8fcfcbff3e610935d02922544e'];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<ApxBtrfly, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: '0xc55126051b22ebb829d00368f4b12bde432de5da', network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<ApxBtrfly>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
