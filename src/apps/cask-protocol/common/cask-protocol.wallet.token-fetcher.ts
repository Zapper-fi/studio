import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CASK_PROTOCOL_DEFINITION } from '../cask-protocol.definition';
import {CaskProtocolContractFactory, CaskVaultToken} from '../contracts';

export class CaskProtocolWalletTokenFetcher implements PositionFetcher<AppTokenPosition> {
  caskVaultContractAddress: string;
  caskNetwork: Network;

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CaskProtocolContractFactory) private readonly caskProtocolContractFactory: CaskProtocolContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<CaskVaultToken>({
      appId: CASK_PROTOCOL_DEFINITION.id,
      groupId: CASK_PROTOCOL_DEFINITION.groups.wallet.id,
      network: this.caskNetwork,
      resolveContract: ({ address, network }) =>
          this.caskProtocolContractFactory.caskVaultToken({ address, network }),
      resolveVaultAddresses: () => [this.caskVaultContractAddress],
      resolveUnderlyingTokenAddress: ({ contract, multicall }) =>
          multicall.wrap(contract).getBaseAsset(),
      resolveReserve: async ({ contract, underlyingToken, multicall}) =>
        multicall
            .wrap(contract)
            .totalValue()
            .then((v) => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: ({ contract, underlyingToken, multicall }) =>
          multicall
              .wrap(contract)
              .pricePerShare()
              .then((v) => Number(v) / 10 ** underlyingToken.decimals),
    });
  }
}
