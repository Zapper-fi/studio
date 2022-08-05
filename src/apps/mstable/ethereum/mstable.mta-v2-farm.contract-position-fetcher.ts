import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MstableContractFactory, MstableStakingV2 } from '../contracts';
import { MSTABLE_DEFINITION } from '../mstable.definition';

const MTA_V2_FARMS = [
  {
    address: '0x8f2326316ec696f6d023e37a9931c2b2c177a3d7',
    stakedTokenAddress: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2', // MTA
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0xefbe22085d9f29863cfb77eed16d3cc0d927b011',
    stakedTokenAddress: '0xe2469f47ab58cf9cf59f9822e3c5de4950a41c49', // MTA / WETH Staking BPT
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
];
const appId = MSTABLE_DEFINITION.id;
const groupId = MSTABLE_DEFINITION.groups.mtaV2Farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMstableMtaV2FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MstableContractFactory) private readonly contractFactory: MstableContractFactory,
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly helper: SingleStakingFarmContractPositionHelper,
  ) {}

  async getPositions() {
    return this.helper.getContractPositions<MstableStakingV2>({
      network,
      appId,
      groupId,
      resolveFarmDefinitions: async () => MTA_V2_FARMS,
      resolveFarmContract: ({ network, address }) => this.contractFactory.mstableStakingV2({ network, address }),
      resolveIsActive: async ({ multicall, contract }) => {
        const lastRewardTimeRaw = await multicall.wrap(contract).lastTimeRewardApplicable();

        // Add an hour buffer for determining active state
        const now = Math.floor(Date.now() / 1000) - 60 * 60;
        const isActive = Number(lastRewardTimeRaw) >= now;
        return isActive;
      },
      resolveRois: async ({ multicall, contract, rewardTokens, liquidity }) => {
        const globalData = await multicall.wrap(contract).globalData();

        const rewardRate = new BigNumber(globalData.rewardRate.toString())
          .div(10 ** rewardTokens[0].decimals)
          .toNumber();

        const dailyRewardRate = rewardRate * 86400;
        const dailyRewardRateUSD = dailyRewardRate * rewardTokens[0].price;

        const dailyROI = (dailyRewardRateUSD + liquidity) / liquidity - 1;
        const weeklyROI = dailyROI * 7;
        const yearlyROI = dailyROI * 365;

        return { dailyROI, weeklyROI, yearlyROI };
      },
      dependencies: [{ appId: BALANCER_V2_DEFINITION.id, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id], network }],
    });
  }
}
