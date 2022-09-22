import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types';

import { MyceliumContractFactory } from '../contracts';
import MYCELIUM_DEFINITION from '../mycelium.definition';

import { MyceliumApiHelper } from './mycelium.api.helper';
import { MYCELIUM_FARMS } from './mycelium.constants';
import { MyceliumPoolsApiDatas } from './mycelium.interface';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.perpFarms.id;
const network = Network.ARBITRUM_MAINNET;

@Injectable()
export class MyceliumPerpTokensFarmHelper {
  constructor(
    @Inject(MyceliumContractFactory) private readonly myceliumContractFactory: MyceliumContractFactory,
    @Inject(MyceliumApiHelper) private readonly myceliumApiHelper: MyceliumApiHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getFarmPositions({ address, shortToken, longToken }: MyceliumPoolsApiDatas) {
    const shortFarm = MYCELIUM_FARMS.find(
      farm => farm.pool.toLowerCase() === address.toLowerCase() && farm.type === 'short' && !farm.isBPTFarm,
    );
    const longFarm = MYCELIUM_FARMS.find(
      farm => farm.pool.toLowerCase() === address.toLowerCase() && farm.type === 'long' && !farm.isBPTFarm,
    );

    if (!shortFarm && !longFarm) return [];

    const positions: Array<ContractPosition> = [];

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const multicall = this.appToolkit.getMulticall(network);

    if (shortFarm) {
      const shortFarmContract = this.myceliumContractFactory.myceliumPerpFarm({
        address: shortFarm.address,
        network,
      });

      const rewardsTokenAddress = await multicall.wrap(shortFarmContract).rewardsToken();
      const rewardsToken = baseTokens.find(token => token.address.toLowerCase() === rewardsTokenAddress.toLowerCase());

      if (rewardsToken) {
        positions.push({
          type: ContractType.POSITION,
          appId,
          groupId,
          address: shortFarm.address,
          network,
          tokens: [claimable(rewardsToken)],
          displayProps: {
            label: `Staked ${shortToken.name}`,
            images: [getTokenImg(rewardsToken.address, network)],
            statsItems: [],
          },
          dataProps: {
            rewardsTokenAddress,
            decimals: shortToken.decimals,
          },
        });
      }
    }

    if (longFarm) {
      const longFarmContract = this.myceliumContractFactory.myceliumPerpFarm({
        address: longFarm.address,
        network,
      });

      const rewardsTokenAddress = await multicall.wrap(longFarmContract).rewardsToken();
      const rewardsToken = baseTokens.find(token => token.address.toLowerCase() === rewardsTokenAddress.toLowerCase());

      if (rewardsToken) {
        positions.push({
          type: ContractType.POSITION,
          appId,
          groupId,
          address: longFarm.address,
          network,
          tokens: [claimable(rewardsToken)],
          displayProps: {
            label: `Staked ${longToken.name}`,
            images: [getTokenImg(rewardsToken.address, network)],
            statsItems: [],
          },
          dataProps: {
            rewardsTokenAddress,
            decimals: longToken.decimals,
          },
        });
      }
    }
    return positions;
  }

  async getPositions() {
    const rawPools = await this.myceliumApiHelper.getMyceliumPools();
    let appTokensFarms: Array<ContractPosition> = [];
    await Promise.all(
      rawPools.map(async rawPool => {
        const tokensFarms = await this.getFarmPositions(rawPool);
        appTokensFarms = [...appTokensFarms, ...tokensFarms];
      }),
    );
    return appTokensFarms;
  }
}
