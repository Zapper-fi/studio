import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MstableContractFactory } from '../contracts';
import { MstableMetavault4626 } from '../contracts/ethers';
import { MSTABLE_DEFINITION } from '../mstable.definition';

const appId = MSTABLE_DEFINITION.id;
const groupId = MSTABLE_DEFINITION.groups.mvUsdc3Pcv.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumMstableMvUsdc3PcvTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MstableContractFactory) private readonly mstableContractFactory: MstableContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<MstableMetavault4626>({
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) => this.mstableContractFactory.mstableMetavault4626({ address, network }),
      resolveVaultAddresses: async () => ['0x455fb969dc06c4aa77e7db3f0686cc05164436d2'],
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).asset(),
      resolveReserve: ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .totalAssets()
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    });
  }
}
