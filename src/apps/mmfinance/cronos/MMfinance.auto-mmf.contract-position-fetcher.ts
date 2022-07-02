import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmfinanceContractFactory, MmfinanceMmfChef } from '../contracts';
import { MMFINANCE_DEFINITION } from '../mmfinance.definition';

const appId = MMFINANCE_DEFINITION.id;
const groupId = MMFINANCE_DEFINITION.groups.autoMmf.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosChainMmfinanceAutoCakeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmfinanceContractFactory)
    private readonly contractFactory: MmfinanceContractFactory,
  ) { }

  getPositions() {
    const chefContract = this.contractFactory.mmfinanceChef({
      network,
      address: '0x6bE34986Fdd1A91e4634eb6b9F8017439b7b5EDc',
    });
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<MmfinanceMmfChef>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc',
      resolveContract: opts => this.contractFactory.mmfinanceMmfChef(opts),
      resolvePoolLength: async () => BigNumber.from(1),
      resolveDepositTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveLiquidity: ({ multicall, contract }) => multicall.wrap(contract).balanceOf(),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).token(),
      rewardRateUnit: RewardRateUnit.BLOCK,
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
