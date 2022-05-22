import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlsJonesPlutusChef } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

import { ADDRESSES, VAULTS } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.jones.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusJonesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PlsJonesPlutusChef>({
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [PLUTUS_DEFINITION.groups.ve.id], network }],
      resolveFarmAddresses: async () => [VAULTS.JONES_VAULT],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).plsJones(),
      resolveFarmContract: opts => this.contractFactory.plsJonesPlutusChef(opts),
      resolveRewardTokenAddresses: async () => [ADDRESSES.pls, ADDRESSES.plsDpx, ADDRESSES.plsJones, ADDRESSES.jones],
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
