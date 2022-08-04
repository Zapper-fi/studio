import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MSTABLE_DEFINITION } from '../mstable.definition';

const SAVINGS_VAULTS = [
  {
    address: '0x32aba856dc5ffd5a56bcd182b13380e5c855aa29',
    stakedTokenAddress: '0x5290ad3d83476ca6a2b178cd9727ee1ef72432af', // imUSD
    rewardTokenAddresses: ['0xf501dd45a1198c2e1b5aef5314a68b9006d842e0'], // MTA
  },
];

const appId = MSTABLE_DEFINITION.id;
const groupId = MSTABLE_DEFINITION.groups.savingsVault.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonMstableSavingsVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixSingleStakingFarmContractPositionHelper)
    private readonly helper: SynthetixSingleStakingFarmContractPositionHelper,
  ) {}

  getPositions() {
    return this.helper.getContractPositions({
      appId,
      groupId,
      network,
      dependencies: [{ appId: MSTABLE_DEFINITION.id, groupIds: [MSTABLE_DEFINITION.groups.imusd.id], network }],
      farmDefinitions: SAVINGS_VAULTS,
    });
  }
}
