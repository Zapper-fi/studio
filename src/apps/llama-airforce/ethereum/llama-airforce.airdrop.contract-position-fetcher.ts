import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

const appId = LLAMA_AIRFORCE_DEFINITION.id;
const groupId = LLAMA_AIRFORCE_DEFINITION.groups.airdrop.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLlamaAirforceAirdropContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    return this.appToolkit.helpers.merkleContractPositionHelper.getContractPositions({
      address: '0xa83043df401346a67eddeb074679b4570b956183', // Merkle Claim
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [LLAMA_AIRFORCE_DEFINITION.groups.vault.id], network }],
      rewardTokenAddresses: [
        '0x83507cc8c8b67ed48badd1f59f684d5d02884c81', // uCRV
        '0xf964b0e3ffdea659c44a5a52bc0b82a24b89ce0e', // uFXS
      ],
    });
  }
}
