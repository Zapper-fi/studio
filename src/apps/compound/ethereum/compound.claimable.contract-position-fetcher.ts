import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { COMPOUND_DEFINITION } from '../compound.definition';
import { CompoundClaimableContractPositionHelper } from '../helper/compound.claimable.contract-position-helper';

const appId = COMPOUND_DEFINITION.id;
const groupId = COMPOUND_DEFINITION.groups.claimable.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumCompoundClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CompoundClaimableContractPositionHelper)
    private readonly compoundClaimableContractPositionHelper: CompoundClaimableContractPositionHelper,
  ) {}

  async getPositions() {
    return this.compoundClaimableContractPositionHelper.getPositions({
      network,
      appId,
      groupId,
      lensAddress: '0xd513d22422a3062bd342ae374b4b9c20e0a9a074',
      rewardTokenAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      comptrollerAddress: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
    });
  }
}
