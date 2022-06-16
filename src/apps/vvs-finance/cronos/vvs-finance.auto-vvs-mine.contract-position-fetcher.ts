import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory, VvsVault } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.autoVvsMine.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosVvsFinanceAutoVvsMineContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  getPositions() {
    const chefContract = this.contractFactory.vvsCraftsman({
      network,
      address: '0xdccd6455ae04b03d785f12196b492b18129564bc',
    });
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<VvsVault>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0xa6ff77fc8e839679d4f7408e8988b564de1a2dcd',
      resolveContract: opts => this.contractFactory.vvsVault(opts),
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
        resolveTotalRewardRate: ({ multicall }) => multicall.wrap(chefContract).vvsPerBlock(),
      }),
    });
  }
}
