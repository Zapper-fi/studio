import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingIsActiveStrategy, SynthetixSingleStakingRoiStrategy } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LyraAvalonContractFactory, StakingRewards } from '../contracts';
import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

const appId = LYRA_AVALON_DEFINITION.id;
const groupId = LYRA_AVALON_DEFINITION.groups.staking.id;
const network = Network.OPTIMISM_MAINNET;

const FARM = {
  address: '0xb02e538a08cFA00E9900cf94e33B161323d8D162'.toLowerCase(),
  stakedTokenAddress: '0x70535c46ce04181adf749f34b65b6365164d6b6e'.toLowerCase(),
  rewardTokenAddresses: ['0x50c5725949a6f0c72e6c4a641f24049a917db0cb'.toLowerCase()],
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismLyraAvalonStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) private readonly lyraContractFactory: LyraAvalonContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly synthetixSingleStakingIsActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly synthetixSingleStakingRoiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    const result =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<StakingRewards>({
        network,
        appId,
        groupId,
        dependencies: [{ appId: 'sorbet', groupIds: ['pool'], network }],
        resolveFarmContract: ({ network, address }) => this.lyraContractFactory.stakingRewards({ network, address }),
        resolveIsActive: this.synthetixSingleStakingIsActiveStrategy.build({
          resolvePeriodFinish: ({ contract, multicall }) => multicall.wrap(contract).periodFinish(),
        }),
        resolveRois: this.synthetixSingleStakingRoiStrategy.build({
          resolveRewardRates: ({ contract, multicall }) => multicall.wrap(contract).rewardRate(),
        }),
        resolveFarmDefinitions: async () => [FARM],
      });
    return result;
  }
}
