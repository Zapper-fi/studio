import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { StargateAa, StargateContractFactory } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.auctionLocked.id;
const network = Network.ETHEREUM_MAINNET;

type StargateAuctionLockedAppTokenDataProps = {
  liquidity: number;
  reserve: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargateAuctionLockedTokenFetcher extends AppTokenTemplatePositionFetcher<
  StargateAa,
  StargateAuctionLockedAppTokenDataProps
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

  getContract(address: string): StargateAa {
    return this.contractFactory.stargateAa({ address, network: this.network });
  }

  getAddresses() {
    return ['0x4dfcad285ef39fed84e77edf1b7dbc442565e55e'];
  }

  getUnderlyingTokenAddresses({ contract }: UnderlyingTokensStageParams<StargateAa>) {
    return contract.stargateToken();
  }

  async getDataProps({ appToken }: DataPropsStageParams<StargateAa, StargateAuctionLockedAppTokenDataProps>) {
    const reserve = appToken.supply; // 1:1
    const liquidity = appToken.supply * appToken.price;
    return { reserve, liquidity };
  }
}
