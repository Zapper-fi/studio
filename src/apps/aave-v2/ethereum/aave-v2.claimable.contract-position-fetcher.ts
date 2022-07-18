import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import { AaveV2ClaimableContractPositionHelper } from '../helpers/aave-v2.claimable.contract-position-helper';

const appId = AAVE_V2_DEFINITION.id;
const groupId = AAVE_V2_DEFINITION.groups.claimable.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumAaveV2ClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AaveV2ClaimableContractPositionHelper)
    private readonly aaveV2ClaimableContractPositionHelper: AaveV2ClaimableContractPositionHelper,
  ) {}

  async getPositions() {
    return this.aaveV2ClaimableContractPositionHelper.getTokens({
      appId,
      groupId,
      network,
      incentivesControllerAddress: '0xd784927ff2f95ba542bfc824c8a8a98f3495f6b5',
      protocolDataProviderAddress: '0x057835ad21a177dbdd3090bb1cae03eacf78fc6d',
      rewardTokenAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    });
  }
}
