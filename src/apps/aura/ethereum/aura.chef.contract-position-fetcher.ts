import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';
import { AuraContractFactory, AuraMasterchef } from '../contracts';

const appId = AURA_DEFINITION.id;
const groupId = AURA_DEFINITION.groups.chef.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAuraChefContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly auraContractFactory: AuraContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<AuraMasterchef>({
      address: '0x1ab80f7fb46b25b7e0b2cfac23fc88ac37aaf4e9',
      network,
      appId,
      groupId,
      dependencies: [
        { appId, network, groupIds: [groupId] },
        { appId: BALANCER_V2_DEFINITION.id, network, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id] },
      ],
      resolvePoolIndexIsValid: async ({ contract, poolIndex, multicall }) =>
        // pid 0 is deprecated
        poolIndex > 0 && poolIndex < Number(await multicall.wrap(contract).poolLength()),
      resolveLiquidity: ({ depositTokenAddress, address, multicall }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20({ network, address: depositTokenAddress }))
          .balanceOf(address),
      resolveDepositTokenAddress: ({ contract, multicall, poolIndex }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardRate: async ({ contract, multicall, poolIndex }) => {
        const [rewardPerBlock, totalAllocPoint, { allocPoint }] = await Promise.all([
          multicall.wrap(contract).rewardPerBlock(),
          multicall.wrap(contract).totalAllocPoint(),
          multicall.wrap(contract).poolInfo(poolIndex),
        ]);

        return rewardPerBlock.mul(allocPoint.mul(1000).div(totalAllocPoint)).div(1000);
      },
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveContract: ({ address, network }) => this.auraContractFactory.auraMasterchef({ address, network }),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).cvx(),
    });
  }
}
