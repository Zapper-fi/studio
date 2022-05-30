import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { TRADER_JOE_DEFINITION } from '~apps/trader-joe';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types';

import { PenguinChefV2, PenguinContractFactory, PenguinExtraRewarder } from '../contracts';
import { PENGUIN_DEFINITION } from '../penguin.definition';

const appId = PENGUIN_DEFINITION.id;
const groupId = PENGUIN_DEFINITION.groups.chefV2Farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalanchePenguinChefV2FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PenguinContractFactory) private readonly contractFactory: PenguinContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PenguinChefV2>({
      address: '0x256040dc7b3cecf73a759634fc68aa60ea0d68cb',
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.chefV2Farm.id,
      network: Network.AVALANCHE_MAINNET,
      dependencies: [
        { appId: 'pangolin', groupIds: ['pool'], network },
        { appId: TRADER_JOE_DEFINITION.id, groupIds: [TRADER_JOE_DEFINITION.groups.pool.id], network },
      ],
      resolveContract: ({ address, network }) => this.contractFactory.penguinChefV2({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.poolToken),
      resolveTotalValueLocked: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).totalShares(poolIndex),
      resolveRewardTokenAddresses: this.appToolkit.helpers.masterChefV2ClaimableTokenStrategy.build<
        PenguinChefV2,
        PenguinExtraRewarder
      >({
        resolvePrimaryClaimableToken: ({ multicall, contract }) => multicall.wrap(contract).pefi(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.strategy),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.penguinExtraRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableToken: ({ multicall, poolIndex, rewarderContract }) =>
          multicall
            .wrap(rewarderContract)
            .pendingTokens(poolIndex, ZERO_ADDRESS, 0)
            .catch(() => [[]])
            .then(result =>
              result[0].map(maybeTokenAddressRaw => {
                const maybeTokenAddress = maybeTokenAddressRaw.toLowerCase();
                const wavaxTokenAddress = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
                return maybeTokenAddress === ETH_ADDR_ALIAS ? wavaxTokenAddress : maybeTokenAddress;
              }),
            ),
      }),
      resolveRewardRate: this.appToolkit.helpers.masterChefV2RewardRateStrategy.build<
        PenguinChefV2,
        PenguinExtraRewarder
      >({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolvePrimaryTotalRewardRate: async ({ multicall, contract }) =>
          multicall.wrap(contract).pefiEmissionPerSecond(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.rewarder),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.penguinExtraRewarder({ address: rewarderAddress, network }),
        resolveSecondaryTotalRewardRate: async () => [], // @TODO
      }),
    });
  }
}
