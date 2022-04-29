import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PancakeswapContractFactory, PancakeswapIfoChef } from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

const appId = PANCAKESWAP_DEFINITION.id;
const groupId = PANCAKESWAP_DEFINITION.groups.ifoCake.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) private readonly contractFactory: PancakeswapContractFactory,
  ) {}

  getPositions() {
    const cakeChefContract = this.contractFactory.pancakeswapCakeChef({
      network,
      address: '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc',
    });

    const chefContract = this.contractFactory.pancakeswapChef({
      network,
      address: '0x73feaa1ee314f8c655e354234017be2193c9e24e',
    });
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PancakeswapIfoChef>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0x1b2a2f6ed4a1401e8c73b4c2b6172455ce2f78e8',
      resolveContract: opts => this.contractFactory.pancakeswapIfoChef(opts),
      resolvePoolLength: async () => BigNumber.from(1),
      resolveDepositTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveTotalValueLocked: ({ multicall }) => multicall.wrap(cakeChefContract).balanceOf(),
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ multicall }) =>
          multicall
            .wrap(chefContract)
            .poolInfo(0)
            .then(i => i.allocPoint),
        resolveTotalAllocPoints: ({ multicall }) => multicall.wrap(chefContract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall }) => multicall.wrap(chefContract).cakePerBlock(),
      }),
    });
  }
}
