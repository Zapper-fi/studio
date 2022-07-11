import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { fetchXVaultPositions } from '~apps/vvs-finance';

import { FerroContractFactory, FerroBoost } from '../contracts';
import { FERRO_DEFINITION } from '../ferro.definition';

const appId = FERRO_DEFINITION.id;
const groupId = FERRO_DEFINITION.groups.xferVault.id;
const network = Network.CRONOS_MAINNET;
const dependencies = [{ appId, groupIds: [FERRO_DEFINITION.groups.xfer.id], network }];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosFerroXferVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(FerroContractFactory) private readonly contractFactory: FerroContractFactory,
  ) {}

  async getPositions() {
    return fetchXVaultPositions<FerroBoost>({
      appToolkit: this.appToolkit,
      network,
      appId,
      groupId,
      dependencies,
      address: '0xcf3e157e2491f7d739f8923f6ceaa4656e64c92e',
      resolveContract: ({ network, address }) => this.contractFactory.ferroBoost({ network, address }),
      resolveDepositTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).xFER(),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).fer(),
      resolvePoolInfo: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).poolInfo(poolIndex),
    });
  }
}
