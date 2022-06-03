import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { BALANCER_V1_DEFINITION } from '~apps/balancer-v1/balancer-v1.definition';
import { CURVE_DEFINITION } from '~apps/curve/curve.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory, SynthetixRewards } from '../contracts';
import { SynthetixSingleStakingIsActiveStrategy } from '../helpers/synthetix.single-staking.is-active-strategy';
import { SynthetixSingleStakingRoiStrategy } from '../helpers/synthetix.single-staking.roi-strategy';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const FARMS = [
  // iBTC
  {
    address: '0x167009dcda2e49930a71712d956f02cc980dcc1b',
    stakedTokenAddress: '0xd6014ea05bde904448b743833ddf07c3c7837481',
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // iETH
  {
    address: '0x6d4f135af7dfcd4bdf6dcb9d7911f5d243872a52',
    stakedTokenAddress: '0xa9859874e1743a32409f75bb11549892138bba1e',
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // iETH
  {
    address: '0x3f27c540adae3a9e8c875c61e3b970b559d7f65d',
    stakedTokenAddress: '0xa9859874e1743a32409f75bb11549892138bba1e',
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sTSLA
  {
    address: '0xf0de877f2f9e7a60767f9ba662f10751566ad01c',
    stakedTokenAddress: '0x055db9aff4311788264798356bbf3a733ae181c6', // sTSLA
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // CRV EURS / sEUR
  {
    address: '0xc0d8994cd78ee1980885df1a0c5470fc977b5cfe',
    stakedTokenAddress: '0x194ebd173f6cdace046c53eacce9b953f28411d1',
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
];

@Register.ContractPositionFetcher({
  appId: SYNTHETIX_DEFINITION.id,
  groupId: SYNTHETIX_DEFINITION.groups.farm.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumSynthetixFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
      network: Network.ETHEREUM_MAINNET,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.farm.id,
      dependencies: [
        {
          appId: BALANCER_V1_DEFINITION.id,
          groupIds: [BALANCER_V1_DEFINITION.groups.pool.id],
          network: Network.ETHEREUM_MAINNET,
        },
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network: Network.ETHEREUM_MAINNET,
        },
      ],
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
