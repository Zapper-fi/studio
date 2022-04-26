import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IlluviumContractFactory, IlluviumCorePool } from '../contracts';
import { ILLUVIUM_DEFINITION } from '../illuvium.definition';

const appId = ILLUVIUM_DEFINITION.id;
const groupId = ILLUVIUM_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

// 0x4b6d71711d5405a8cb1df10e8a54d25155abcabf
// Migrated, shows 1.9 in V2, and 1.4 in V1

// 0x1f279aad56278d67d31ca1c89480ac7152e5c45a
// Not migrated, shows 0 in V2, and 3.9 in V1

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumIlluviumFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  private readonly ILV_STAKING_ADDRESS = '0x25121eddf746c884dde4619b573a7b10714e2a36';
  private readonly SLP_ILV_ETH_STAKING_ADDRESS = '0x8b4d8443a0229349a9892d4f7cbe89ef5f843f72';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IlluviumContractFactory) private readonly contractFactory: IlluviumContractFactory,
  ) {}

  async getPositions() {
    return Promise.all([
      // ILV staking
      this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<IlluviumCorePool>({
        appId,
        groupId,
        network,
        resolveFarmAddresses: () => [this.ILV_STAKING_ADDRESS],
        resolveFarmContract: ({ address, network }) => this.contractFactory.illuviumCorePool({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).poolToken(),
        resolveRewardTokenAddresses: ({ contract, multicall }) => multicall.wrap(contract).ilv(),
        resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
      }),
      // ILV/ETH staking
      this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<IlluviumCorePool>({
        appId,
        groupId,
        network,
        dependencies: [{ appId: 'sushiswap', groupIds: ['pool'], network }],
        resolveFarmAddresses: () => [this.SLP_ILV_ETH_STAKING_ADDRESS],
        resolveFarmContract: ({ address, network }) => this.contractFactory.illuviumCorePool({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).poolToken(),
        resolveRewardTokenAddresses: ({ contract, multicall }) => multicall.wrap(contract).ilv(),
        resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
      }),
    ]).then(v => v.flat());
  }
}
