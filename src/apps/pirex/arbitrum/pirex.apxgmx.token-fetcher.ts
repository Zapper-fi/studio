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

import { PirexContractFactory, ApxGmx } from '../contracts';

@PositionTemplate()
export class ArbitrumPirexApxgmxTokenFetcher extends AppTokenTemplatePositionFetcher<ApxGmx> {
  groupLabel = 'Pirex GMX';

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(PirexContractFactory) private readonly pirexContractFactory: PirexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ApxGmx {
    return this.pirexContractFactory.apxGmx({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return ['0x61dbc0d6d7a6bde37f93d2014044a7c6b6de34d2'];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<ApxGmx, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a', network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<ApxGmx>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
