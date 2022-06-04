import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { PIKA_PROTOCOL_DEFINITION } from '../pika-protocol.definition';
import { PikaProtocolContractPositionDataProps } from './pika-protocol.vault.contract-position-fetcher';

const appId = PIKA_PROTOCOL_DEFINITION.id;
const groupId = PIKA_PROTOCOL_DEFINITION.groups.vault.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class OptimismPikaProtocolTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getTvl() {
    const tokens = await this.appToolkit.getAppContractPositions<PikaProtocolContractPositionDataProps>({ appId, groupIds: [groupId], network });

    return sumBy(tokens, v => v.dataProps.totalValueLocked);
  }
}
