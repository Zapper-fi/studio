import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MSTABLE_DEFINITION } from '../mstable.definition';

const MTA_V1_FARM = [
  // MTA staking v1
  {
    address: '0xae8bc96da4f9a9613c323478be181fdb2aa0e1bf',
    stakedTokenAddress: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'],
  },
];
const appId = MSTABLE_DEFINITION.id;
const groupId = MSTABLE_DEFINITION.groups.mtaV1Farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMstableMtaV1FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixSingleStakingFarmContractPositionHelper)
    private readonly helper: SynthetixSingleStakingFarmContractPositionHelper,
  ) {}

  getPositions() {
    return this.helper.getContractPositions({ appId, groupId, network, farmDefinitions: MTA_V1_FARM });
  }
}
