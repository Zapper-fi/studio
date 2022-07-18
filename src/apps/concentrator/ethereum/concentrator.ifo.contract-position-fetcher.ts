import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CONCENTRATOR_DEFINITION } from '../concentrator.definition';
import { ConcentratorContractFactory, AladdinConcentratorIfoVault } from '../contracts';

const appId = CONCENTRATOR_DEFINITION.id;
const groupId = CONCENTRATOR_DEFINITION.groups.ifo.id;
const network = Network.ETHEREUM_MAINNET;

const address = '0x3cf54f3a1969be9916dad548f3c084331c4450b5';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumConcentratorIfoContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) private readonly concentratorContractFactory: ConcentratorContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<AladdinConcentratorIfoVault>({
      address,
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
        {
          appId: CONCENTRATOR_DEFINITION.id,
          groupIds: [CONCENTRATOR_DEFINITION.groups.acrv.id],
          network,
        },
      ],
      resolveContract: ({ address, network }) =>
        this.concentratorContractFactory.aladdinConcentratorIfoVault({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) =>
        Promise.all([multicall.wrap(contract).ctr(), multicall.wrap(contract).aladdinCRV()]),
    });
  }
}
