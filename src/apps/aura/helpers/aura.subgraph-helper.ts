import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AuraBaseRewardPoolHelper } from '~apps/aura/helpers/aura.base-reward-pool-helper';

@Injectable()
export class AuraSubgraphHelper {
  static V1 = 'https://graph.aura.finance/subgraphs/name/aura/aura-mainnet-v1';
  static V2 = 'https://graph.aura.finance/subgraphs/name/aura/aura-mainnet-v2';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraBaseRewardPoolHelper) private readonly auraBaseRewardPoolHelper: AuraBaseRewardPoolHelper,
  ) {}

  async request<T>(query: string, endpoint = AuraSubgraphHelper.V2) {
    return this.appToolkit.helpers.theGraphHelper.request<T>({ query, endpoint });
  }

  async requestAllVersions<T>(query: string) {
    const [v1, v2] = await Promise.all(
      [AuraSubgraphHelper.V1, AuraSubgraphHelper.V2].map(endpoint => this.request<T>(query, endpoint)),
    );

    return {
      v1,
      v2,
    };
  }
}
