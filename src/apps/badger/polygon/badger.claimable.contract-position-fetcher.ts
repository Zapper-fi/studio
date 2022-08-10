import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.claimable.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class PolygonBadgerClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    return this.appToolkit.helpers.merkleContractPositionHelper.getContractPositions({
      address: '0x2c798fafd37c7dcdcac2498e19432898bc51376b',
      appId,
      groupId,
      network,
      dependencies: [
        { appId: BADGER_DEFINITION.id, groupIds: [BADGER_DEFINITION.groups.vault.id], network },
        { appId: 'sushiswap', groupIds: ['x-sushi'], network },
      ],
      rewardTokenAddresses: [
        '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a', // SUSHI
        '0x172370d5cd63279efa6d502dab29171933a610af', // CRV
      ],
    });
  }
}
