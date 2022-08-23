import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsStageParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { StargateContractFactory, StargateEth } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.eth.id;
const network = Network.OPTIMISM_MAINNET;

type StargateEthAppTokenDataProps = {
  liquidity: number;
  reserve: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismStargateEthTokenFetcher extends AppTokenTemplatePositionFetcher<
  StargateEth,
  StargateEthAppTokenDataProps
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Wrapped';

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
    return ['0xd22363e3762ca7339569f3d33eade20127d5f98c'];
  }

  async getUnderlyingTokenAddresses() {
    return [ZERO_ADDRESS];
  }

  async getDataProps({
    appToken,
  }: GetDataPropsStageParams<StargateEth, StargateEthAppTokenDataProps>): Promise<StargateEthAppTokenDataProps> {
    const reserve = appToken.supply; // 1:1
    const liquidity = appToken.supply * appToken.price;
    return { reserve, liquidity };
  }
}
