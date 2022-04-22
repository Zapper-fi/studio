import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingRoiStrategy } from '~apps/synthetix';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PickleContractFactory } from '../contracts';
import { PickleJarSingleRewardStaking } from '../contracts/ethers/PickleJarSingleRewardStaking';
import { PickleApiJarRegistry } from '../helpers/pickle.api.jar-registry';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.ContractPositionFetcher({
  appId: PICKLE_DEFINITION.id,
  groupId: PICKLE_DEFINITION.groups.singleStakingFarm.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumPickleSingleRewardPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) private readonly pickleContractFactory: PickleContractFactory,
    @Inject(PickleApiJarRegistry) private readonly jarCacheManager: PickleApiJarRegistry,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly synthetixSingleStakingRoiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    const network = Network.ETHEREUM_MAINNET;
    const vaults = await this.jarCacheManager.getJarDefinitions({ network });

    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PickleJarSingleRewardStaking>(
      {
        network,
        appId: PICKLE_DEFINITION.id,
        groupId: PICKLE_DEFINITION.groups.singleStakingFarm.id,
        dependencies: [{ appId: PICKLE_DEFINITION.id, groupIds: [PICKLE_DEFINITION.groups.jar.id], network }],
        resolveFarmDefinitions: async () =>
          vaults.map(({ vaultAddress, gaugeAddress }) => ({
            address: gaugeAddress ?? '',
            stakedTokenAddress: vaultAddress,
            rewardTokenAddresses: [PICKLE_DEFINITION.token.address],
          })),
        resolveFarmContract: ({ address }) =>
          this.pickleContractFactory.pickleJarSingleRewardStaking({ network, address }),
        resolveRois: this.synthetixSingleStakingRoiStrategy.build({
          resolveRewardRates: ({ contract, multicall }) => multicall.wrap(contract).rewardRate(),
        }),
      },
    );
  }
}
