import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PancakeswapChef, PancakeswapContractFactory } from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

const appId = PANCAKESWAP_DEFINITION.id;
const groupId = PANCAKESWAP_DEFINITION.groups.farm.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class BinanceSmartChainPancakeswapFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) private readonly contractFactory: PancakeswapContractFactory,
  ) {}

  getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PancakeswapChef>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0x73feaa1ee314f8c655e354234017be2193c9e24e',
      dependencies: [{ appId, groupIds: [PANCAKESWAP_DEFINITION.groups.pool.id], network }],
      resolveContract: opts => this.contractFactory.pancakeswapChef(opts),
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

        const autoCakeChefContract = this.contractFactory.pancakeswapCakeChef({
          network,
          address: '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc',
        });

        // Subtract the balance reserve for Auto CAKE staking
        const autoCakeVaultBalanceRaw = await multicall.wrap(autoCakeChefContract).balanceOf();
        return balanceRaw.sub(autoCakeVaultBalanceRaw);
      },
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).cake(),
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(i => i.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).cakePerBlock(),
      }),
    });
  }
}
