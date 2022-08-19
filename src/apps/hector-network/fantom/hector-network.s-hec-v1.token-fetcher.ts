import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { DisplayProps } from '~position/display.interface';
import {
  AppTokenTemplatePositionFetcher,
  DisplayPropsStageParams,
  DataPropsStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory, HectorNetworkStaked } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

type HectorNetworkSHecV1DataProps = {
  liquidity: number;
};

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.sHecV1.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkSHecV1TokenFetcher extends AppTokenTemplatePositionFetcher<
  HectorNetworkStaked,
  HectorNetworkSHecV1DataProps
> {
  appId = appId;
  groupId = groupId;
  network = network;

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

  async getUnderlyingTokenAddresses(_params: UnderlyingTokensStageParams<HectorNetworkStaked>) {
    return '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
  }

  async getDataProps({ appToken }: DataPropsStageParams<HectorNetworkStaked, HectorNetworkSHecV1DataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }

  async getLabel(
    _params: DisplayPropsStageParams<HectorNetworkStaked, HectorNetworkSHecV1DataProps>,
  ): Promise<DisplayProps['label']> {
    return 'Staked HEC V1';
  }
}
