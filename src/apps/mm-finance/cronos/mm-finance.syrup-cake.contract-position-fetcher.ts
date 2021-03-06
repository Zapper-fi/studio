// 0xa5f8c5dbd5f286960b9d90548680ae5ebff07652 => LP Staking

import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmFinanceContractFactory, MmFinanceSyrupMeerkat } from '../contracts';
import { MM_FINANCE_DEFINITION } from '../mm-finance.definition';

const appId = MM_FINANCE_DEFINITION.id;
const groupId = MM_FINANCE_DEFINITION.groups.syrupMmf.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosMmFinanceSyrupMeerkatContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmFinanceContractFactory)
    private readonly contractFactory: MmFinanceContractFactory,
  ) {}

  getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<MmFinanceSyrupMeerkat>({
      network,
      groupId,
      appId,
      address: '0x45c54210128a065de780c4b0df3d16664f7f859e',
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveContract: opts => this.contractFactory.mmFinanceSyrupMeerkat(opts),
      resolvePoolLength: async () => BigNumber.from(1),
      resolveDepositTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveLiquidity: ({ multicall, contract }) => multicall.wrap(contract).available(),
      resolveRewardRate: async ({ multicall, network }) => {
        // The auto-compounding MEERKAT rewards are harvested from the main MasterChef V2 contract on PID 0
        const masterChefV2Address = '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652';
        const masterChefV2Contract = this.contractFactory.mmFinanceChefV2({ address: masterChefV2Address, network });
        const poolInfo = await multicall.wrap(masterChefV2Contract).poolInfo(0);
        const meerkatPerBlock = await multicall.wrap(masterChefV2Contract).meerkatPerBlock(poolInfo.isRegular);
        const poolAllocPoints = poolInfo.allocPoint;
        const totalAllocPoints = await (poolInfo.isRegular
          ? masterChefV2Contract.totalRegularAllocPoint()
          : masterChefV2Contract.totalSpecialAllocPoint());

        const poolShare = Number(poolAllocPoints) / Number(totalAllocPoints);
        const rewardPerBlock = poolShare * Number(meerkatPerBlock);
        return rewardPerBlock;
      },
    });
  }
}
