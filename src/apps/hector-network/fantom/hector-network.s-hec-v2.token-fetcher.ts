import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory, HectorNetworkStaked } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

type HectorNetworkSHecV2DataProps = {
  liquidity: number;
};

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.sHecV2.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkSHecV2TokenFetcher extends AppTokenTemplatePositionFetcher<
  HectorNetworkStaked,
  HectorNetworkSHecV2DataProps
> {
  appId = appId;
  groupId = groupId;
  network = network;
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
