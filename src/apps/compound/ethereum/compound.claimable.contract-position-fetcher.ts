import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { CompoundClaimableContractPositionFetcher } from '../common/compound.claimable.contract-position-fetcher';
import { COMPOUND_DEFINITION } from '../compound.definition';

@Injectable()
export class EthereumCompoundClaimableContractPositionFetcher extends CompoundClaimableContractPositionFetcher {
  appId = COMPOUND_DEFINITION.id;
  groupId = COMPOUND_DEFINITION.groups.claimable.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Claimable';
  isExcludedFromExplore = true;

  lensAddress = '0xd513d22422a3062bd342ae374b4b9c20e0a9a074';
  rewardTokenAddress = '0xc00e94cb662c3520282e6f5717214004a7f26888';
  comptrollerAddress = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';
}
