import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetAddressesParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { JonesDaoContractFactory, JonesStrategyToken } from '../contracts';

export type JonesDaoStrategyTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumJonesDaoStrategyTokenFetcher extends AppTokenTemplatePositionFetcher<JonesStrategyToken> {
  groupLabel = 'Advanced Strategies';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoContractFactory) protected readonly contractFactory: JonesDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): JonesStrategyToken {
    return this.contractFactory.jonesStrategyToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<JonesDaoStrategyTokenDefinition[]> {
    return [
      {
        address: '0x17ff154a329e37282eb9a76c3ae848fc277f24c7',
        underlyingTokenAddress: '0x7241bc8035b65865156ddb5edef3eb32874a3af6', // jGLP
      },
      {
        address: '0xa485a0bc44988b95245d5f20497ccaff58a73e99',
        underlyingTokenAddress: '0xe66998533a1992ece9ea99cdf47686f4fc8458e0', // jUSDC
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<JonesStrategyToken, JonesDaoStrategyTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
