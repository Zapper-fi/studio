import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';

import AURA_DEFINITION from '../aura.definition';

type AuraLockerResponse = {
  auraLocker: {
    totalSupply: string;
    rewardData: {
      token: { id: string };
      rewardRate: string;
    }[];
  };
};

type AuraLocker = {
  totalSupply: string;
  rewardData: {
    address: string;
    rewardRate: string;
  }[];
};

const AURA_LOCKER_QUERY = gql`
  {
    auraLocker(id: "auraLocker") {
      totalSupply
      rewardData {
        rewardRate
        token {
          id
        }
      }
    }
  }
`;

@Injectable()
export class AuraLockerRewardResolver {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: `studio:${AURA_DEFINITION.id}:locker-reward:data`,
    ttl: 15 * 60,
  })
  async getAuraLockerData(): Promise<AuraLocker> {
    const endpoint = `https://api.thegraph.com/subgraphs/name/aurafinance/aura`;
    const {
      auraLocker: { rewardData, totalSupply },
    } = await this.appToolkit.helpers.theGraphHelper.request<AuraLockerResponse>({
      endpoint,
      query: AURA_LOCKER_QUERY,
    });

    return {
      totalSupply,
      rewardData: rewardData.map(({ token: { id }, rewardRate }) => ({ address: id.toLowerCase(), rewardRate })),
    };
  }
}
