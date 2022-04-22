import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

type Location = { network: Network; address: string };

export class OlympusBridgeTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions({
    src,
    dest,
    appId,
    groupId,
  }: {
    src: Location;
    dest: Location;
    appId: string;
    groupId: string;
  }): Promise<AppTokenPosition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      network: src.network,
      groupIds: [groupId],
    });

    const srcToken = appTokens.find(m => m.address === src.address);
    if (!srcToken) return [];

    return [
      {
        ...srcToken,
        network: dest.network,
        address: dest.address,
      },
    ];
  }
}
