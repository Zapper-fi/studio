import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANCOR_DEFINITION } from '../bancor.definition';
import { BancorContractFactory, StandardRewards } from '../contracts';

const appId = BANCOR_DEFINITION.id;
const groupId = BANCOR_DEFINITION.groups.v3.id;
const network = Network.ETHEREUM_MAINNET;
export const address = '0xb0B958398ABB0b5DB4ce4d7598Fb868f5A00f372'.toLowerCase();

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumBancorV3ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorContractFactory) private readonly bancorContractFactory: BancorContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<StandardRewards>({
      address,
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: BANCOR_DEFINITION.id,
          groupIds: [BANCOR_DEFINITION.groups.v3.id],
          network,
        },
      ],
      resolveContract: ({ address, network }) => this.bancorContractFactory.standardRewards({ address, network }),
      resolvePoolLength: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .programIds()
          .then(ids => ids.length),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .programs([poolIndex + 1])
          .then(v => v[0][1]),
      resolveRewardTokenAddresses: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .programs([poolIndex + 1])
          .then(v => v[0][3]),
    });
  }
}
