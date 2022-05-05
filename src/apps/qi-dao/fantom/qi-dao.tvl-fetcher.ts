import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { QiDaoVaultPositionDataProps } from '../helpers/qi-dao.vault.position-helper';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const appId = QI_DAO_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TvlFetcher({ appId, network })
export class FantomQiDaoTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const vaultPositions = await this.appToolkit.getAppContractPositions<QiDaoVaultPositionDataProps>({
      appId,
      groupIds: [QI_DAO_DEFINITION.groups.vault.id],
      network,
    });

    return sumBy(vaultPositions, v => v.dataProps.liquidity);
  }
}
