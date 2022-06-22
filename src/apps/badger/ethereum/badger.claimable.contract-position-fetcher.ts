import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.claimable.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumBadgerClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.merkleContractPositionHelper.getContractPositions({
      address: '0x660802fc641b154aba66a62137e71f331b6d787a',
      appId,
      groupId,
      network,
      dependencies: [{ appId: BADGER_DEFINITION.id, groupIds: [BADGER_DEFINITION.groups.vault.id], network }],
      rewardTokenAddresses: [
        '0x3472a5a71965499acd81997a54bba8d852c6e53d',
        '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
        '0x798d1be841a82a273720ce31c822c61a67a601c3',
        '0xa0246c9032bc3a600820415ae600c6388619a14d',
      ],
    });
  }
}
