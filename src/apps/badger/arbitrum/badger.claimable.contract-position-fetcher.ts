import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.claimable.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumBadgerClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.merkleContractPositionHelper.getContractPositions({
      address: '0x635eb2c39c75954bb53ebc011bdc6afaace115a6',
      appId,
      groupId,
      network,
      dependencies: [{ appId: BADGER_DEFINITION.id, groupIds: [BADGER_DEFINITION.groups.vault.id], network }],
      rewardTokenAddresses: [
        '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978',
        '0xbfa641051ba0a0ad1b0acf549a89536a0d76472e',
        '0x0c2153e8ae4db8233c61717cdc4c75630e952561',
        '0xe774d1fb3133b037aa17d39165b8f45f444f632d',
      ],
    });
  }
}
