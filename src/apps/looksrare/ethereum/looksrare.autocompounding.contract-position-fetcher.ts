import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { Aggregator, LooksrareContractFactory } from '../contracts';
import { LOOKSRARE_DEFINITION } from '../looksrare.definition';

const appId = LOOKSRARE_DEFINITION.id;
const groupId = LOOKSRARE_DEFINITION.groups.autocompounding.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLooksrareAutocompoundingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LooksrareContractFactory) private readonly looksrareContractFactory: LooksrareContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<Aggregator>({
      appId,
      groupId,
      network,
      resolveFarmAddresses: async () => ['0x3ab16Af1315dc6C95F83Cbf522fecF98D00fd9ba'],
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).looksRareToken(),
      resolveFarmContract: opts => this.looksrareContractFactory.aggregator(opts),
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
