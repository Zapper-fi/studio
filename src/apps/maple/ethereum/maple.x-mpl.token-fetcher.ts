import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MapleContractFactory } from '../contracts';
import { MapleXMpl } from '../contracts/ethers/MapleXMpl';
import { MAPLE_DEFINITION } from '../maple.definition';

const appId = MAPLE_DEFINITION.id;
const groupId = MAPLE_DEFINITION.groups.xMpl.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumMapleXMplTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MapleContractFactory) private readonly mapleContractFactory: MapleContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<MapleXMpl>({
      appId: MAPLE_DEFINITION.id,
      groupId: MAPLE_DEFINITION.groups.xMpl.id,
      network: Network.ETHEREUM_MAINNET,
      resolveContract: ({ address, network }) => this.mapleContractFactory.mapleXMpl({ address, network }),
      resolveVaultAddresses: () => ['0x4937a209d4cdbd3ecd48857277cfd4da4d82914c'],
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).asset(),
      resolveReserve: async ({ underlyingToken, multicall, contract }) =>
        multicall
          .wrap(contract)
          .totalAssets()
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    });
  }
}
