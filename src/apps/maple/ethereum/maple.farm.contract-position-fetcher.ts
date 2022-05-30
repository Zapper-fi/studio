import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingIsActiveStrategy, SynthetixSingleStakingRoiStrategy } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types';

import { MapleContractFactory, MapleRewards } from '../contracts';
import { MapleCacheManager } from '../helpers/maple.cache-manager';
import { MAPLE_DEFINITION } from '../maple.definition';

const appId = MAPLE_DEFINITION.id;
const groupId = MAPLE_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMapleFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MapleCacheManager) private readonly mapleCacheManager: MapleCacheManager,
    @Inject(MapleContractFactory) private readonly mapleContractFactory: MapleContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly isActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly roiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    const poolData = (await this.mapleCacheManager.getCachedPoolData()) ?? [];

    const farms = poolData
      .filter(v => v.farmAddress !== ZERO_ADDRESS)
      .map(v => ({
        address: v.farmAddress,
        stakedTokenAddress: v.poolAddress,
        rewardTokenAddresses: ['0x33349b282065b0284d756f0577fb39c158f935e6'], // MPL
      }));

    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<MapleRewards>({
      appId,
      groupId,
      network,
      dependencies: [{ appId: MAPLE_DEFINITION.id, groupIds: [MAPLE_DEFINITION.groups.pool.id], network }],
      resolveFarmDefinitions: async () => farms,
      resolveFarmContract: ({ address, network }) => this.mapleContractFactory.mapleRewards({ address, network }),
      resolveTotalValueLocked: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveIsActive: this.isActiveStrategy.build({
        resolvePeriodFinish: ({ multicall, contract }) => multicall.wrap(contract).periodFinish(),
      }),
      resolveRois: this.roiStrategy.build({
        resolveRewardRates: ({ multicall, contract }) => multicall.wrap(contract).rewardRate(),
      }),
    });
  }
}
