import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusBondContractPositionHelper } from '../helpers/olympus.bond.contract-position-helper';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

@Register.ContractPositionFetcher({
  appId: OLYMPUS_DEFINITION.id,
  groupId: OLYMPUS_DEFINITION.groups.bond.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumOlympusBondContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(OlympusBondContractPositionHelper)
    private readonly olympusContractPositionHelper: OlympusBondContractPositionHelper,
  ) {}
  async getPositions(): Promise<ContractPosition[]> {
    const network = Network.ETHEREUM_MAINNET;
    const depositories = [{ depositoryAddress: '0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6', symbol: 'gOHM' }];

    return this.olympusContractPositionHelper.getPositions({
      appId: OLYMPUS_DEFINITION.id,
      network,
      mintedTokenAddress: '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f', // gOHM
      groupId: OLYMPUS_DEFINITION.groups.bond.id,
      depositories,
      dependencies: [{ appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network }],
    });
  }
}
