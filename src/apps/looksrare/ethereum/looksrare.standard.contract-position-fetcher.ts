import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { Feesharing, LooksrareContractFactory } from '../contracts';
import { LOOKSRARE_DEFINITION } from '../looksrare.definition';

const appId = LOOKSRARE_DEFINITION.id;
const groupId = LOOKSRARE_DEFINITION.groups.standard.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLooksrareStandardContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LooksrareContractFactory) private readonly looksrareContractFactory: LooksrareContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<Feesharing>({
      appId,
      groupId,
      network,
      resolveFarmAddresses: async () => ['0xBcD7254A1D759EFA08eC7c3291B2E85c5dCC12ce'],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).looksRareToken(),
      resolveFarmContract: opts => this.looksrareContractFactory.feesharing(opts),
      resolveRewardTokenAddresses: async ({ multicall, contract }) => multicall.wrap(contract).rewardToken(),
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
