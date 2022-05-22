import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlsDpxPlutusChef } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

import { ADDRESSES, VAULTS } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.dpx.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusDpxContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PlsDpxPlutusChef>({
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [PLUTUS_DEFINITION.groups.ve.id], network }],
      resolveFarmAddresses: async () => [VAULTS.DPX_VAULT],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).plsDpx(),
      resolveFarmContract: opts => this.contractFactory.plsDpxPlutusChef(opts),
      resolveRewardTokenAddresses: async () => [
        ADDRESSES.pls,
        ADDRESSES.plsDpx,
        ADDRESSES.plsJones,
        ADDRESSES.dpx,
        ADDRESSES.rdpx,
      ],
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
