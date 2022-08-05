import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MSTABLE_DEFINITION } from '../mstable.definition';

const SAVINGS_VAULTS = [
  {
    address: '0x78befca7de27d07dc6e71da295cc2946681a6c7b',
    stakedTokenAddress: '0x30647a72dc82d7fbb1123ea74716ab8a317eac19', // imUSD
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
];

const network = Network.ETHEREUM_MAINNET;
const groupId = MSTABLE_DEFINITION.groups.savingsVault.id;
const appId = MSTABLE_DEFINITION.id;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMstableSavingsVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
