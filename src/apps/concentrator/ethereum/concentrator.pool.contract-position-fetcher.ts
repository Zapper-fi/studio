import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory, AladdinConvexVault } from '../contracts';

const appId = CONCENTRATOR_DEFINITION.id;
const groupId = CONCENTRATOR_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumConcentratorPoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) private readonly concentratorContractFactory: ConcentratorContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<AladdinConvexVault>({
      address: '0xc8fF37F7d057dF1BB9Ad681b53Fa4726f268E0e8',
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveContract: ({ address, network }) =>
        this.concentratorContractFactory.aladdinConvexVault({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: () => Promise.resolve([]), // TODO: set to aCRV
    });
  }
}
