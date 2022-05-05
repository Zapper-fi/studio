import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { SynthetixContractFactory, SynthetixRewards } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TOKEMAK_DEFINITION } from '../tokemak.definition';

const FARMS = [
  // TOKE
  {
    address: '0x96f98ed74639689c3a11daf38ef86e59f43417d3',
    stakedTokenAddress: '0x2e9d63788249371f1dfc918a52f8d799f4a38c94',
    rewardTokenAddresses: ['0x2e9d63788249371f1dfc918a52f8d799f4a38c94'],
  },
];

const appId = TOKEMAK_DEFINITION.id;
const groupId = TOKEMAK_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumTokemakFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<SynthetixRewards>({
      network,
      appId,
      groupId,
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) =>
        this.synthetixContractFactory.synthetixRewards({ network, address }),
      resolveIsActive: () => true,
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
