import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const network = Network.AURORA_MAINNET;

export type BastionBorrowContractPositionDataProps = CompoundSupplyTokenDataProps & {
  supply: number;
  borrow: number;
};

@Register.TvlFetcher({ appId, network })
export class AuroraBastionProtocolTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }


  async getTvl() {
    const appTokens = await this.appToolkit.getAppTokenPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [
        BASTION_PROTOCOL_DEFINITION.groups.supply.id,
        BASTION_PROTOCOL_DEFINITION.groups.swap.id,
      ],
      network,
    });

    return sumBy(appTokens, b => b.dataProps.liquidity);
  }
}
