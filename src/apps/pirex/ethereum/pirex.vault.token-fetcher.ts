import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PirexContractFactory } from '../contracts';
import { PirexPxCvx } from '../contracts/ethers';
import { PIREX_DEFINITION } from '../pirex.definition';

const appId = PIREX_DEFINITION.id;
const groupId = PIREX_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPirexVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PirexContractFactory) private readonly pirexContractFactory: PirexContractFactory,
  ) {}

  async getPositions() {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<PirexPxCvx>({
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) => this.pirexContractFactory.pirexPxCvx({ address, network }),
      resolveVaultAddresses: async () => [
        '0xbce0cf87f513102f22232436cca2ca49e815c3ac', // pxCVX
      ],
      resolveUnderlyingTokenAddress: () => '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
      resolvePricePerShare: async () => 1,
      resolveReserve: async ({ multicall, underlyingToken, address }) =>
        multicall
          .wrap(this.pirexContractFactory.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
    });
  }
}
