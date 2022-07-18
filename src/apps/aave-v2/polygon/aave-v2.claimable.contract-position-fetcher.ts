import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import { AaveV2ClaimableContractPositionHelper } from '../helpers/aave-v2.claimable.contract-position-helper';

const appId = AAVE_V2_DEFINITION.id;
const groupId = AAVE_V2_DEFINITION.groups.claimable.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class PolygonAaveV2ClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AaveV2ClaimableContractPositionHelper)
    private readonly aaveV2ClaimableContractPositionHelper: AaveV2ClaimableContractPositionHelper,
  ) {}

  async getPositions() {
    return this.aaveV2ClaimableContractPositionHelper.getTokens({
      appId,
      groupId,
      network,
      incentivesControllerAddress: '0x357d51124f59836ded84c8a1730d72b749d8bc23',
      protocolDataProviderAddress: '0x7551b5d2763519d4e37e8b81929d336de671d46d',
      rewardTokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    });
  }
}
