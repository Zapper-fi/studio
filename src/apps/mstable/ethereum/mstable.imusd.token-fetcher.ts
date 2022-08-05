import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MstableContractFactory } from '../contracts';
import { MstableAsset } from '../contracts/ethers';
import { MSTABLE_DEFINITION } from '../mstable.definition';

const appId = MSTABLE_DEFINITION.id;
const groupId = MSTABLE_DEFINITION.groups.imusd.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumMstableImusdTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MstableContractFactory) private readonly contractFactory: MstableContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<MstableAsset>({
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.mstableAsset({ address, network }),
      resolveVaultAddresses: async () => ['0x30647a72dc82d7fbb1123ea74716ab8a317eac19'],
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).asset(),
      resolvePricePerShare: ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .exchangeRate()
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolveReserve: ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .totalAssets()
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
    });
  }
}
