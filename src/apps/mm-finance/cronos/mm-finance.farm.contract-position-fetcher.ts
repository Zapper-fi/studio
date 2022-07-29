import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmFinanceChef, MmFinanceContractFactory } from '../contracts';
import { MM_FINANCE_DEFINITION } from '../mm-finance.definition';

const appId = MM_FINANCE_DEFINITION.id;
const groupId = MM_FINANCE_DEFINITION.groups.farm.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosMmFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmFinanceContractFactory) private readonly contractFactory: MmFinanceContractFactory,
  ) {}

  getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<MmFinanceChef>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0x6be34986fdd1a91e4634eb6b9f8017439b7b5edc',
      dependencies: [{ appId, groupIds: [MM_FINANCE_DEFINITION.groups.pool.id], network }],
      resolveContract: opts => this.contractFactory.mmFinanceChef(opts),
      resolvePoolLength: async ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ multicall, contract, poolIndex }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(i => i.lpToken),
      resolveLiquidity: async ({ multicall, depositTokenAddress, address, poolIndex }) => {
        const tokenContract = this.contractFactory.erc20({ network, address: depositTokenAddress });
        const balanceRaw = await multicall.wrap(tokenContract).balanceOf(address);
        if (poolIndex !== 0) return balanceRaw;

        const autoMeerkatChefContract = this.contractFactory.mmFinanceMeerkatChef({
          network,
          address: '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc',
        });

        // Subtract the balance reserve for Auto MEERKAT staking
        const autoCakeVaultBalanceRaw = await multicall.wrap(autoMeerkatChefContract).balanceOf();
        return balanceRaw.sub(autoCakeVaultBalanceRaw);
      },
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).meerkat(),
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(i => i.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).meerkatPerBlock(),
      }),
    });
  }
}
