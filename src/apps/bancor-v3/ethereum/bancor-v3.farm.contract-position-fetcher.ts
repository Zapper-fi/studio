import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANCOR_V3_DEFINITION } from '../bancor-v3.definition';
import { BancorV3ContractFactory, StandardRewards } from '../contracts';

const appId = BANCOR_V3_DEFINITION.id;
const groupId = BANCOR_V3_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;
const address = '0xb0B958398ABB0b5DB4ce4d7598Fb868f5A00f372'.toLowerCase();

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumBancorV3ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ContractFactory) private readonly contractFactory: BancorV3ContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<StandardRewards>({
      address,
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [BANCOR_V3_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.standardRewards({ address, network }),
      resolvePoolLength: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .programIds()
          .then(ids => ids.length),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .programs([poolIndex + 1])
          .then(v => v[0][2]),
      resolveRewardTokenAddresses: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .programs([poolIndex + 1])
          .then(v => v[0][3]),
    });
  }
}
