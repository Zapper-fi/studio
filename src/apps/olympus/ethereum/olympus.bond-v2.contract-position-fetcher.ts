import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusBondV2ContractPositionHelper } from '../helpers/olympus.bondV2.contract-position-helper';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

@Register.ContractPositionFetcher({
  appId: OLYMPUS_DEFINITION.id,
  groupId: OLYMPUS_DEFINITION.groups.bondV2.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumOlympusBondV2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(OlympusBondV2ContractPositionHelper)
    private readonly olympusContractPositionHelper: OlympusBondV2ContractPositionHelper,
  ) {}
  async getPositions(): Promise<ContractPosition[]> {
    const network = Network.ETHEREUM_MAINNET;
    const depositories = [{ depositoryAddress: '0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6', symbol: 'gOHM' }];

    return this.olympusContractPositionHelper.getPositions({
      appId: OLYMPUS_DEFINITION.id,
      network,
      groupId: OLYMPUS_DEFINITION.groups.bondV2.id,
      depositories,
    });
  }
}
