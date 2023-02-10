import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetUnderlyingTokensParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { BeanstalkContractFactory, BeanstalkToken } from '../contracts';

export type BeanstalkUnripeAssetsTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumBeanstalkUnripeAssetsTokenFetcher extends AppTokenTemplatePositionFetcher<
  BeanstalkToken,
  DefaultAppTokenDataProps,
  BeanstalkUnripeAssetsTokenDefinition
> {
  groupLabel = 'Unripe Assets';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeanstalkContractFactory) private readonly contractFactory: BeanstalkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BeanstalkToken {
    return this.contractFactory.beanstalkToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<BeanstalkUnripeAssetsTokenDefinition[]> {
    return [
      {
        address: '0x1bea0050e63e05fbb5d8ba2f10cf5800b6224449', // urBEAN
        underlyingTokenAddress: '0xbea0000029ad1c77d3d5d23ba2d8893db9d1efab', // BEAN
      },
      {
        address: '0x1bea3ccd22f4ebd3d37d731ba31eeca95713716d', // urBEAN3CRVLP
        underlyingTokenAddress: '0xc9c32cd16bf7efb85ff14e0c8603cc90f6f2ee49', // BEAN3CRVLP
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams<BeanstalkUnripeAssetsTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<BeanstalkToken, BeanstalkUnripeAssetsTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
