import { Inject } from '@nestjs/common';

<<<<<<< HEAD
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
=======
>>>>>>> 84ff57d00a4e4cd08b15494fdd0541bf614c9614
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GOOD_GHOSTING_DEFINITION } from '../good-ghosting.definition';
import { NetworkId } from '../helpers/constants';
<<<<<<< HEAD
import { GoodGhostingContractFactory } from '../contracts';
=======
>>>>>>> 84ff57d00a4e4cd08b15494fdd0541bf614c9614
import { GoodGhostingGameContractPositionFetcherHelper } from '../helpers/good-ghosting.game.contract-position-fetcher-helper';

const appId = GOOD_GHOSTING_DEFINITION.id;
const groupId = GOOD_GHOSTING_DEFINITION.groups.game.id;
const network = Network.CELO_MAINNET;
const networkId = NetworkId.CeloMainnet;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CeloGoodGhostingGameContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
<<<<<<< HEAD
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingContractFactory) private readonly goodGhostingContractFactory: GoodGhostingContractFactory,

=======
>>>>>>> 84ff57d00a4e4cd08b15494fdd0541bf614c9614
    @Inject(GoodGhostingGameContractPositionFetcherHelper)
    private readonly helper: GoodGhostingGameContractPositionFetcherHelper,
  ) {}

  async getPositions() {
    return this.helper.getContractPosition(network, networkId, appId, groupId);
  }
}
