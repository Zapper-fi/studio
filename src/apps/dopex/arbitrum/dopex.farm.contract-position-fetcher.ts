import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingIsActiveStrategy } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DopexContractFactory, DopexStaking } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';
import { DopexDualRewardFarmRoiStrategy } from '../helpers/dopex.dual-reward-farm.roi-strategy';

const FARMS = [
  // LEGACY SUSHI DPX/WETH
  // {
  //   address: '0x96b0d9c85415c69f4b2fac6ee9e9ce37717335b4',
  //   stakedTokenAddress: '0x0c1cf6883efa1b496b01f654e247b9b419873054',
  //   rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  // },
  // LEGACY SUSHI rDPX/WETH
  // {
  //   address: '0x03ac1aa1ff470cf376e6b7cd3a3389ad6d922a74',
  //   stakedTokenAddress: '0x7418f5a2621e13c05d1efbd71ec922070794b90a',
  //   rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  // },
  // SUSHI DPX/WETH
  {
    address: '0x1f80c96ca521d7247a818a09b0b15c38e3e58a28',
    stakedTokenAddress: '0x0c1cf6883efa1b496b01f654e247b9b419873054',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
  // SUSHI rDPX/WETH
  {
    address: '0xeb0f03a203f25f08c7aff0e1b1c2e0ee25ca29eb',
    stakedTokenAddress: '0x7418f5a2621e13c05d1efbd71ec922070794b90a',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
  // DPX
  {
    address: '0xc6d714170fe766691670f12c2b45c1f34405aab6',
    stakedTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
  // rDPX v1
  {
    address: '0x8d481245801907b45823fb032e6848d0d3c29ae5',
    stakedTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
  // rDPX v2
  {
    address: '0x125cc7cce81a809c825c945e5aa874e60cccb6bb',
    stakedTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212',
    rewardTokenAddresses: ['0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', '0x32eb7902d4134bf98a28b963d26de779af92a212'],
  },
];

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory)
    private readonly dopexContractFactory: DopexContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly synthetixSingleStakingIsActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(DopexDualRewardFarmRoiStrategy)
    private readonly dopexDualRewardFarmRoiStrategy: DopexDualRewardFarmRoiStrategy,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<DopexStaking>({
      network,
      appId,
      groupId,
      dependencies: [
        {
          appId: 'sushiswap',
          groupIds: ['pool'],
          network,
        },
      ],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) => this.dopexContractFactory.dopexStaking({ network, address }),
      resolveIsActive: this.synthetixSingleStakingIsActiveStrategy.build({
        resolvePeriodFinish: ({ contract, multicall }) => multicall.wrap(contract).periodFinish(),
      }),
      resolveRois: this.dopexDualRewardFarmRoiStrategy.build(),
    });
  }
}
