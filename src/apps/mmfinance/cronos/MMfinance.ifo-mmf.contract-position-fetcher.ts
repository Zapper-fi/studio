import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmfinanceContractFactory, MmfinanceIfoChef } from '../contracts';
import { MMFINANCE_DEFINITION } from '../mmfinance.definition';

const appId = MMFINANCE_DEFINITION.id;
const groupId = MMFINANCE_DEFINITION.groups.ifoMmf.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosChainMmfinanceIfoCakeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmfinanceContractFactory) private readonly contractFactory: MmfinanceContractFactory,
  ) { }

  getPositions() {
    const cakeChefContract = this.contractFactory.mmfinanceMeerkatChef({
      network,
      address: '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc',
    });

    const chefContract = this.contractFactory.mmfinanceChef({
      network,
      address: '0x6bE34986Fdd1A91e4634eb6b9F8017439b7b5EDc',
    });
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<MmfinanceIfoChef>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0x1b2a2f6ed4a1401e8c73b4c2b6172455ce2f78e8',
      resolveContract: opts => this.contractFactory.mmfinanceIfoChef(opts),
      resolvePoolLength: async () => BigNumber.from(1),
      resolveDepositTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveLiquidity: ({ multicall }) => multicall.wrap(cakeChefContract).balanceOf(),
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ multicall }) =>
          multicall
            .wrap(chefContract)
            .poolInfo(0)
            .then(i => i.allocPoint),
        resolveTotalAllocPoints: ({ multicall }) => multicall.wrap(chefContract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall }) => multicall.wrap(chefContract).meerkatPerBlock(),
      }),
    });
  }
}
