import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlsDpxPlutusChefV2 } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

import { ADDRESSES, VAULTS } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.plsDpxFarmV2.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusPlsDpxFarmV2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PlsDpxPlutusChefV2>({
      address: VAULTS.DPX_VAULT,
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: PLUTUS_DEFINITION.id,
          groupIds: [PLUTUS_DEFINITION.groups.plsDpx.id, PLUTUS_DEFINITION.groups.plsJones.id],
          network,
        },
      ],
      resolveContract: opts => this.contractFactory.plsDpxPlutusChefV2(opts),
      resolvePoolLength: async () => 1,
      resolveDepositTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).plsDpx(),
      resolveRewardTokenAddresses: async () => [ADDRESSES.pls, ADDRESSES.plsDpx, ADDRESSES.plsJones, ADDRESSES.dpx],
    });
  }
}
