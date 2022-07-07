import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { LlamaAirforceContractFactory, LlamaAirforceUnionVault } from '../contracts';
import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

const appId = LLAMA_AIRFORCE_DEFINITION.id;
const groupId = LLAMA_AIRFORCE_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumLlamaAirforceVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LlamaAirforceContractFactory) private readonly llamaAirforceContractFactory: LlamaAirforceContractFactory,
  ) {}

  async getPositions() {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<LlamaAirforceUnionVault>({
      appId,
      groupId,
      network,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) =>
        this.llamaAirforceContractFactory.llamaAirforceUnionVault({ address, network }),
      resolveVaultAddresses: async () => [
        '0x83507cc8c8b67ed48badd1f59f684d5d02884c81', // uCRV
        '0xf964b0e3ffdea659c44a5a52bc0b82a24b89ce0e', // uFXS
      ],
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).underlying(),
      resolvePricePerShare: async ({ reserve, supply }) => reserve / supply,
      resolveReserve: async ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .totalUnderlying()
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePrimaryLabel: ({ underlyingToken }) => `${getLabelFromToken(underlyingToken)} Pounder`,
    });
  }
}
