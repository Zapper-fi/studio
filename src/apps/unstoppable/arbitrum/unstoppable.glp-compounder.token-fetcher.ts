import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { UnstoppableGlpVault, UnstoppableContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumUnstoppableGlpCompounderTokenFetcher extends AppTokenTemplatePositionFetcher<UnstoppableGlpVault> {
  groupLabel = 'GLP Compounder';

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(UnstoppableContractFactory) private readonly unstoppableContractFactory: UnstoppableContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): UnstoppableGlpVault {
    return this.unstoppableContractFactory.unstoppableGlpVault({ address: _address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return ['0xff6b69b78df465bf7e55d242fd11456158d1600a'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258', network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<UnstoppableGlpVault>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve / appToken.supply];
  }
}
