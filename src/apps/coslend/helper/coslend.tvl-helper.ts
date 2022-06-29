import { Inject, Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { CoslendBorrowContractPositionDataProps } from './coslend.borrow.contract-position-helper';

@Injectable()
export class CoslendTvlHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  /**
   *
   * @param config - Configuration to retrieve borrowed contract positions
   * @param config.appId - Application ID. Usually should be provided from the app definition
   * @param config.groupIds- List of group ids that target BORROWED contract positions.
   * @param config.network- Network in which we wish to fetch the data from
   * @description Infer the total liquidity of a coslend like app by inferring
   * each underlying liquidity of borrowed positions. This is typically the value used
   * to display the TVL a la DefiLama, eg: liquidity is the TVL, not the total supply.
   * @returns Total liquidity derived from all borrowed positions
   */
  public async getLiquidityBasedOnBorrowedPositions({
    appId,
    groupIds,
    network,
  }: {
    appId: string;
    groupIds: string[];
    network: Network;
  }) {
    const borrow = await this.appToolkit.getAppContractPositions<CoslendBorrowContractPositionDataProps>({
      appId,
      groupIds,
      network,
    });

    return sumBy(borrow, b => b.dataProps.liquidity);
  }

  /**
   *
   * @param config - Configuration to retrieve borrowed contract positions
   * @param config.appId - Application ID. Usually should be provided from the app definition
   * @param config.groupIds- List of group ids that target BORROWED contract positions.
   * @param config.network- Network in which we wish to fetch the data from
   * @description Infer the total supply of a coslend like app by inferring
   * each subtokens liquidity of borrowed positions. Usually, this is an "all encompassing"
   * TVL, since it includes the total liquidity + the total borrowed amount.
   * This method can paint a somewhat inacurate picture of TVL, as factoring in total value borrowed
   * can lead to inflated values.
   * @returns Total supply derived from all borrowed positions
   */
  public async getTotalSupplyBasedOnBorrowedPositions({
    appId,
    groupIds,
    network,
  }: {
    appId: string;
    groupIds: string[];
    network: Network;
  }) {
    const borrow = await this.appToolkit.getAppContractPositions<CoslendBorrowContractPositionDataProps>({
      appId,
      groupIds,
      network,
    });
    return sumBy(borrow, b => b.dataProps.supply);
  }
}
