import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MakerContractFactory, MakerGovernance } from '../contracts';
import { MAKER_DEFINITION } from '../maker.definition';

const FARMS = [
  // MKR
  {
    address: '0x9ef05f7f6deb616fd37ac3c959a2ddd25a54e4f5',
    stakedTokenAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    rewardTokenAddresses: ['0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'],
  },
];

const appId = MAKER_DEFINITION.id;
const groupId = MAKER_DEFINITION.groups.governance.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMakerGovernanceContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(MakerContractFactory)
    private readonly makerContractFactory: MakerContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<MakerGovernance>({
      network: Network.ETHEREUM_MAINNET,
      appId: MAKER_DEFINITION.id,
      groupId: MAKER_DEFINITION.groups.governance.id,
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) => this.makerContractFactory.makerGovernance({ network, address }),
      resolveIsActive: () => true,
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
