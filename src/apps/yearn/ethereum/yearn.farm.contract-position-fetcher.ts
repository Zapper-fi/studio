import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  SynthetixContractFactory,
  SynthetixRewards,
  SynthetixSingleStakingIsActiveStrategy,
  SynthetixSingleStakingRoiStrategy,
} from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YEARN_DEFINITION } from '../yearn.definition';

const FARMS = [
  // YFI
  {
    address: '0xba37b002abafdd8e89a1995da52740bbc013d992',
    stakedTokenAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    rewardTokenAddresses: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8'],
  },
];

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumYearnFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly synthetixSingleStakingIsActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly synthetixSingleStakingRoiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<SynthetixRewards>({
      appId,
      groupId,
      network,
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) =>
        this.synthetixContractFactory.synthetixRewards({ network, address }),
      resolveIsActive: this.synthetixSingleStakingIsActiveStrategy.build({
        resolvePeriodFinish: ({ contract, multicall }) => multicall.wrap(contract).periodFinish(),
      }),
      resolveRois: this.synthetixSingleStakingRoiStrategy.build({
        resolveRewardRates: ({ contract, multicall }) => multicall.wrap(contract).rewardRate(),
      }),
    });
  }
}
