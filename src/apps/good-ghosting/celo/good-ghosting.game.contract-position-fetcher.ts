import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GoodGhostingContractFactory } from '../contracts';
import { GOOD_GHOSTING_DEFINITION } from '../good-ghosting.definition';
import { NetworkId } from '../helpers/constants';
import { GoodGhostingGameContractPositionFetcherHelper } from '../helpers/good-ghosting.game.contract-position-fetcher-helper';

const appId = GOOD_GHOSTING_DEFINITION.id;
const groupId = GOOD_GHOSTING_DEFINITION.groups.game.id;
const network = Network.CELO_MAINNET;
const networkId = NetworkId.CeloMainnet;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CeloGoodGhostingGameContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingContractFactory) private readonly goodGhostingContractFactory: GoodGhostingContractFactory,

    @Inject(GoodGhostingGameContractPositionFetcherHelper)
    private readonly helper: GoodGhostingGameContractPositionFetcherHelper,
  ) {}

  async getPositions() {
    return this.helper.getContractPosition(network, networkId, appId, groupId);
  }
}
