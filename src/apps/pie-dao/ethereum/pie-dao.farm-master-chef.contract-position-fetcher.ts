import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PieDaoContractFactory, PieDaoStaking } from '../contracts';
import { PIE_DAO_DEFINITION } from '../pie-dao.definition';

const appId = PIE_DAO_DEFINITION.id;
const groupId = PIE_DAO_DEFINITION.groups.farmMasterChef.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPieDaoFarmMasterChefContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PieDaoContractFactory)
    private readonly contractFactory: PieDaoContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PieDaoStaking>({
      address: '0x6de77a304609472a4811a0bfd47d8682aebc29df',
      appId,
      groupId,
      network,
      dependencies: [
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: 'balancer-v1', groupIds: ['pool'], network },
      ],
      resolveContract: ({ address, network }) => this.contractFactory.pieDaoStaking({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolCount(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall.wrap(contract).getPoolToken(poolIndex),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).reward(),
      resolveRewardRate: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).getPoolRewardRate(poolIndex),
    });
  }
}
