import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { LlamaAirforceContractFactory, LlamaAirforceUnionVaultPirex } from '../contracts';
import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

const appId = LLAMA_AIRFORCE_DEFINITION.id;
const groupId = LLAMA_AIRFORCE_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumLlamaAirforceVaultPirexTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LlamaAirforceContractFactory) private readonly llamaAirforceContractFactory: LlamaAirforceContractFactory,
  ) {}

  async getPositions() {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<LlamaAirforceUnionVaultPirex>({
      appId,
      groupId,
      network,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) =>
        this.llamaAirforceContractFactory.llamaAirforceUnionVaultPirex({ address, network }),
      resolveVaultAddresses: async () => [
        '0x8659fc767cad6005de79af65dafe4249c57927af', // uCVX
      ],
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).asset(),
      resolvePricePerShare: async ({ reserve, supply }) => reserve / supply,
      resolveReserve: async ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .totalAssets()
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePrimaryLabel: ({ underlyingToken }) => `${getLabelFromToken(underlyingToken)} Pounder`,
    });
  }
}
