import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory, VvsBoost } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

import { fetchXVaultPositions } from '../helpers/fetch-xvault-positions';

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.xvvsVault.id;
const network = Network.CRONOS_MAINNET;
const dependencies = [{ appId, groupIds: [VVS_FINANCE_DEFINITION.groups.xvvs.id], network }];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosVvsFinanceXvvsVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  async getPositions() {
    return fetchXVaultPositions<VvsBoost>({
      appToolkit: this.appToolkit,
      network,
      appId,
      groupId,
      dependencies,
      address: '0x990e9683e6ba5079cdb235838856029a50dad84c',
      resolveContract: ({ network, address }) => this.contractFactory.vvsBoost({ network, address }),
      resolveDepositTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).xvvs(),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).vvs(),
      resolvePoolInfo: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).poolInfo(poolIndex),
    });
  }
}
