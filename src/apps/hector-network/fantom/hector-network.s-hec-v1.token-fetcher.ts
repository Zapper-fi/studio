import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DisplayProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { HectorNetworkContractFactory, HectorNetworkStaked } from '../contracts';

type HectorNetworkSHecV1DataProps = {
  liquidity: number;
};

@PositionTemplate()
export class FantomHectorNetworkSHecV1TokenFetcher extends AppTokenTemplatePositionFetcher<
  HectorNetworkStaked,
  HectorNetworkSHecV1DataProps
> {
  groupLabel = 'Staked HEC V1';

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
    return ['0x36f26880c6406b967bdb9901cde43abc9d53f106'];
  }

  async getUnderlyingTokenAddresses(_params: GetUnderlyingTokensParams<HectorNetworkStaked>) {
    return '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
  }

  async getDataProps({ appToken }: GetDataPropsParams<HectorNetworkStaked, HectorNetworkSHecV1DataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }

  async getLabel(
    _params: GetDisplayPropsParams<HectorNetworkStaked, HectorNetworkSHecV1DataProps>,
  ): Promise<DisplayProps['label']> {
    return 'Staked HEC V1';
  }
}
