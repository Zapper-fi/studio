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

import { PirexContractFactory, ApxGlp } from '../contracts';

@PositionTemplate()
export class ArbitrumPirexApxglpTokenFetcher extends AppTokenTemplatePositionFetcher<ApxGlp> {
  groupLabel = 'Pirex GMX';

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(PirexContractFactory) private readonly pirexContractFactory: PirexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ApxGlp {
    return this.pirexContractFactory.apxGlp({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return ['0x6cec1903eae091bdc532cfde68fff0723fd3ee14'];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<ApxGlp, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258', network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<ApxGlp>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
