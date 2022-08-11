import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateAa, StargateContractFactory } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.auctionLocked.id;
const network = Network.ETHEREUM_MAINNET;

const ADDRESS = ['0x4dfcad285ef39fed84e77edf1b7dbc442565e55e'];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargateAuctionLockedTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) private readonly contractFactory: StargateContractFactory,
  ) {}

  async getPositions() {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<StargateAa>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => ADDRESS,
      resolveContract: ({ address, network }) => this.contractFactory.stargateAa({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).stargateToken(),
      resolveReserve: ({ multicall, contract }) => multicall.wrap(contract).totalSupply().then(Number),
      resolvePricePerShare: () => 1,
    });
  }
}
