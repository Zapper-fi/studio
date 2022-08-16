import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Erc20 } from '~contract/contracts';
import { DisplayProps } from '~position/display.interface';
import {
  AppTokenTemplatePositionFetcher,
  DisplayPropsStageParams,
  DataPropsStageParams,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

type HectorNetworkWsHecDataProps = {
  liquidity: number;
};

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.wsHec.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkWsHecTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  HectorNetworkWsHecDataProps
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

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x94ccf60f700146bea8ef7832820800e2dfa92eda'];
  }

  async getUnderlyingTokenAddresses(_params: UnderlyingTokensStageParams<Erc20>) {
    return '0x75bdef24285013387a47775828bec90b91ca9a5f';
  }

  async getPricePerShare({ appToken, multicall }: PricePerShareStageParams<Erc20, HectorNetworkWsHecDataProps>) {
    const underlyingToken = appToken.tokens[0];
    const underlyingTokenContract = multicall.wrap(this.contractFactory.erc20(underlyingToken));
    const reserveRaw = await underlyingTokenContract.balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve / appToken.supply;
  }

  async getDataProps({ appToken }: DataPropsStageParams<Erc20, HectorNetworkWsHecDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }

  async getLabel(_params: DisplayPropsStageParams<Erc20, HectorNetworkWsHecDataProps>): Promise<DisplayProps['label']> {
    return 'Wrapped sHEC';
  }
}
