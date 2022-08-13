// 0xa5f8c5dbd5f286960b9d90548680ae5ebff07652 => LP Staking

import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PancakeswapContractFactory, PancakeswapSyrupCake } from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

const appId = PANCAKESWAP_DEFINITION.id;
const groupId = PANCAKESWAP_DEFINITION.groups.syrupCake.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory)
    private readonly contractFactory: PancakeswapContractFactory,
  ) {}

  getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PancakeswapSyrupCake>({
      network,
      groupId,
      appId,
      address: '0x45c54210128a065de780c4b0df3d16664f7f859e',
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveContract: opts => this.contractFactory.pancakeswapSyrupCake(opts),
      resolvePoolLength: async () => BigNumber.from(1),
      resolveDepositTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveLiquidity: ({ multicall, contract }) => multicall.wrap(contract).available(),
      resolveRewardRate: async ({ multicall, network }) => {
        // The auto-compounding CAKE rewards are harvested from the main MasterChef V2 contract on PID 0
        const masterChefV2Address = '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652';
        const masterChefV2Contract = this.contractFactory.pancakeswapChefV2({ address: masterChefV2Address, network });
        const poolInfo = await multicall.wrap(masterChefV2Contract).poolInfo(0);
        const cakePerBlock = await multicall.wrap(masterChefV2Contract).cakePerBlock(poolInfo.isRegular);
        const poolAllocPoints = poolInfo.allocPoint;
        const totalAllocPoints = await (poolInfo.isRegular
          ? masterChefV2Contract.totalRegularAllocPoint()
          : masterChefV2Contract.totalSpecialAllocPoint());

        const poolShare = Number(poolAllocPoints) / Number(totalAllocPoints);
        const rewardPerBlock = poolShare * Number(cakePerBlock);
        return rewardPerBlock;
      },
      resolveLabel: ({ rewardTokens }) => `Earn ${getLabelFromToken(rewardTokens[0])}`,
    });
  }
}
