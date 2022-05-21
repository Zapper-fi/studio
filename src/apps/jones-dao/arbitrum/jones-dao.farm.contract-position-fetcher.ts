import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  SynthetixContractFactory,
  SynthetixRewards,
  SynthetixSingleStakingIsActiveStrategy,
  SynthetixSingleStakingRoiStrategy,
} from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { JONES_DAO_DEFINITION } from '../jones-dao.definition';

const FARMS = [
  // JONES StakingRewards
  {
    address: '0xf1a26Cf6309a59794da29B5b2E6fABD3070d470f',
    stakedTokenAddress: '0x10393c20975cf177a3513071bc110f7962cd67da',
    rewardTokenAddresses: ['0x10393c20975cf177a3513071bc110f7962cd67da'],
  },
  // JONES-ETH LP StakingRewards
  {
    address: '0x360a766f30f0ba57d2865efb32502fb800b14dd3',
    stakedTokenAddress: '0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c',
    rewardTokenAddresses: ['0x10393c20975cf177a3513071bc110f7962cd67da'],
  },
  // JONES-USDC LP StakingRewards
  {
    address: '0x13f6a63867046107780bc3febdee90e7afcdfd99',
    stakedTokenAddress: '0xa6efc26daa4bb2b9bf5d23a0bc202a2badc2b59e',
    rewardTokenAddresses: ['0x10393c20975cf177a3513071bc110f7962cd67da'],
  },
  // jETH-ETH LP StakingRewards
  {
    address: '0xbac58e8b57935a0b60d5cb4cd9f6c21049595f04',
    stakedTokenAddress: '0xdf1a6dd4e5b77d7f2143ed73074be26c806754c5',
    rewardTokenAddresses: ['0x10393c20975cf177a3513071bc110f7962cd67da'],
  },
  // jgOHM-gOHM LP StakingRewards
  {
    address: '0x7ece38dbe9d61d0d9bf2d804a87a7d21b5937a56',
    stakedTokenAddress: '0x292d1587a6bb37e34574c9ad5993f221d8a5616c',
    rewardTokenAddresses: ['0x10393c20975cf177a3513071bc110f7962cd67da'],
  },
  // jDPX-DPX LP StakingRewards
  {
    address: '0x5723be83199c9ec68ed0ac979e98381224870e7f',
    stakedTokenAddress: '0xeeb24360c8c7a87933d16b0075e10e1a30ad65b7',
    rewardTokenAddresses: ['0x10393c20975cf177a3513071bc110f7962cd67da'],
  },
];

const appId = JONES_DAO_DEFINITION.id;
const groupId = JONES_DAO_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumJonesDaoFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly synthetixSingleStakingIsActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly synthetixSingleStakingRoiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<SynthetixRewards>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: 'sushiswap', groupIds: ['pool'], network }],
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
