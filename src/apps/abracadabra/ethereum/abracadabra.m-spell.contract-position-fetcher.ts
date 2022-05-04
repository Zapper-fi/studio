import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory, AbracadabraMspell } from '../contracts';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
const network = Network.ETHEREUM_MAINNET;
@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAbracadabraMspellContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory)
    private readonly contractFactory: AbracadabraContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<AbracadabraMspell>({
      appId,
      groupId,
      network,
      resolveFarmAddresses: async () => ['0xbd2fbaf2dc95bd78cf1cd3c5235b33d1165e6797'],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).spell(),
      resolveFarmContract: opts => this.contractFactory.abracadabraMspell(opts),
      resolveRewardTokenAddresses: async ({ multicall, contract }) => multicall.wrap(contract).mim(),
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
