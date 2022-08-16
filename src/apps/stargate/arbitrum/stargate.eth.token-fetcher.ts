import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { StargateContractFactory, StargateEth } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.eth.id;
const network = Network.ARBITRUM_MAINNET;

type StargateEthAppTokenDataProps = {
  liquidity: number;
  reserve: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumStargateEthTokenFetcher extends AppTokenTemplatePositionFetcher<
  StargateEth,
  StargateEthAppTokenDataProps
> {
  appId = appId;
  groupId = groupId;
  network = network;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) protected readonly contractFactory: StargateContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StargateEth {
    return this.contractFactory.stargateEth({ address, network: this.network });
  }

  getAddresses() {
    return ['0x915a55e36a01285a14f05de6e81ed9ce89772f8e'];
  }

  async getUnderlyingTokenAddresses() {
    return [ZERO_ADDRESS];
  }

  async getDataProps({
    appToken,
  }: DataPropsStageParams<StargateEth, StargateEthAppTokenDataProps>): Promise<StargateEthAppTokenDataProps> {
    const reserve = appToken.supply; // 1:1
    const liquidity = appToken.supply * appToken.price;
    return { reserve, liquidity };
  }
}
