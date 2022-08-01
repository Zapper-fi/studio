import { Inject, Injectable } from '@nestjs/common';
import { entries } from 'lodash';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Schedule } from '~scheduler/scheduler.decorator';
import { Network } from '~types/network.interface';

export type VotiumActiveTokenData = {
  value: string;
  label: string;
  symbol: string;
  decimals: number;
};

@Injectable()
export abstract class MerkleCache<T = any> {
  protected abstract readonly appId: string;
  protected abstract readonly groupId: string;
  protected abstract readonly network: Network;

  protected abstract resolveMerkleData(): Promise<Record<string, Record<string, T>>>;

  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private getKey(rewardTokenAddress: string, walletAddress: string) {
    const fields = [this.appId, this.groupId, this.network, rewardTokenAddress, walletAddress];
    const key = fields.map(v => v.toLowerCase()).join(':');
    return `studio:merkle:${key}`;
  }

  @Schedule({
    every: moment.duration('15', 'minutes').asMilliseconds(),
  })
  async cacheMerkleData() {
    const data = await this.resolveMerkleData();

    const cacheable = entries(data).flatMap(([rewardTokenAddress, claims]) => {
      return entries(claims).map(([walletAddress, claim]) => {
        return [this.getKey(rewardTokenAddress, walletAddress), claim] as [string, T];
      });
    });

    await this.appToolkit.msetToCache(cacheable, moment.duration('30', 'minutes').asSeconds());
  }

  async getClaim(rewardTokenAddress: string, walletAddress: string) {
    return this.appToolkit.getFromCache<T>(this.getKey(rewardTokenAddress, walletAddress));
  }
}
