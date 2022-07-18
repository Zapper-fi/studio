import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmFinanceContractFactory, MmFinanceMeerkatChef } from '../contracts';
import { MM_FINANCE_DEFINITION } from '../mm-finance.definition';

const appId = MM_FINANCE_DEFINITION.id;
const groupId = MM_FINANCE_DEFINITION.groups.autoMmf.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosMmFinanceAutoMmfContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmFinanceContractFactory)
    private readonly contractFactory: MmFinanceContractFactory,
  ) {}

  getPositions() {
    const chefContract = this.contractFactory.mmFinanceChef({
      network,
      address: '0x6be34986fdd1a91e4634eb6b9f8017439b7b5edc',
    });

    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<MmFinanceMeerkatChef>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc',
      resolveContract: opts => this.contractFactory.mmFinanceMeerkatChef(opts),
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
