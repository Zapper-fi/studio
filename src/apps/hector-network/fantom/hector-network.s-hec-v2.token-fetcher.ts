import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { HectorNetworkContractFactory, HectorNetworkStaked } from '../contracts';

type HectorNetworkSHecV2DataProps = {
  liquidity: number;
};

@PositionTemplate()
export class FantomHectorNetworkSHecV2TokenFetcher extends AppTokenTemplatePositionFetcher<
  HectorNetworkStaked,
  HectorNetworkSHecV2DataProps
> {
  groupLabel = 'Staked HEC V2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): HectorNetworkStaked {
    return this.contractFactory.hectorNetworkStaked({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x75bdef24285013387a47775828bec90b91ca9a5f'];
  }

  async getUnderlyingTokenAddresses(_params: GetUnderlyingTokensParams<HectorNetworkStaked>) {
    return '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
  }

  async getDataProps({ appToken }: GetDataPropsParams<HectorNetworkStaked, HectorNetworkSHecV2DataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }

  async getLabel(_params: GetDisplayPropsParams<HectorNetworkStaked, HectorNetworkSHecV2DataProps>) {
    return 'Staked HEC V2';
  }
}
