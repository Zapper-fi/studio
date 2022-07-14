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
  // CRV EURS / sEUR
  {
    address: '0xc0d8994cd78ee1980885df1a0c5470fc977b5cfe',
    stakedTokenAddress: '0x194ebd173f6cdace046c53eacce9b953f28411d1',
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // CRV BTC
  {
    address: '0x13c1542a468319688b89e323fe9a3be3a90ebb27',
    stakedTokenAddress: '0xb94865e18b25114b2b10bd9ecbd689c877f949e8', // sbtcCRV
    rewardTokenAddresses: ['0x075b1bb99792c9e1041ba13afef80c91a1e70fb3'],
  },
  // CRV USDC
  {
    address: '0x13c1542a468319688b89e323fe9a3be3a90ebb27',
    stakedTokenAddress: '0xb94865e18b25114b2b10bd9ecbd689c877f949e8', // sbtcCRV
    rewardTokenAddresses: ['0x075b1bb99792c9e1041ba13afef80c91a1e70fb3'],
  },
  // BPT sUSD / sAAPL
  {
    address: '0x7af65f1740c0eb816a27fd808eaf6ab09f6fa646',
    stakedTokenAddress: '0xb94865e18b25114b2b10bd9ecbd689c877f949e8', // sAAPL
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sAMZN
  {
    address: '0xdc338c7544654c7dadfeb7e44076e457963113b0',
    stakedTokenAddress: '0x74821343b5b969c0d4b31aff3931e00a40990cfd', // sAMZN
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sCOIN
  {
    address: '0x1c1d97f6338759ab814a5a717ae359573ab5d5d4',
    stakedTokenAddress: '0x2e27d4160b257708375a7bf23381110d2328bc1b', // sCOIN
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sFB
  {
    address: '0x26fa0665660c1d3a3666584669511d3c66ad37cb',
    stakedTokenAddress: '0x3f2d077acff8a66c4e0c79c37b6a662a7197889b', // sFB
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sGOOG
  {
    address: '0x6fb7f0e78582746bd01bcb6dfbfe62ca5f4f9175',
    stakedTokenAddress: '0x608410f602ce8967d1e59f599566aed340280efc', // sGOOG
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sMSFT
  {
    address: '0x9d003cc298e7ea141a809c241c0a703176da3ba3',
    stakedTokenAddress: '0x41c91eb43b7f0afd332725461b86a0e39e143789', // sMSFT
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sNFLX
  {
    address: '0x8ef8ca2acaaafec19fb366c11561718357f780f2',
    stakedTokenAddress: '0x6418c69b0de51873a1cc01cf73ba6e408acc1940', // sNFLX
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
  // BPT sUSD / sTSLA
  {
    address: '0xf0de877f2f9e7a60767f9ba662f10751566ad01c',
    stakedTokenAddress: '0x055db9aff4311788264798356bbf3a733ae181c6', // sTSLA
    rewardTokenAddresses: ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'],
  },
];

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
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
    return await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<SynthetixRewards>(
      {
        network,
        appId,
        groupId,
        dependencies: [
          {
            appId: BALANCER_V1_DEFINITION.id,
            groupIds: [BALANCER_V1_DEFINITION.groups.pool.id],
            network,
          },
          {
            appId: CURVE_DEFINITION.id,
            groupIds: [CURVE_DEFINITION.groups.pool.id],
            network,
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
      },
    );
  }
}
