import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ATLENDIS_V_1_DEFINITION } from '../atlendis-v1.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(ATLENDIS_V_1_DEFINITION.id, network)
export class PolygonAtlendisV1BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositionBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      groupId: ATLENDIS_V_1_DEFINITION.groups.position.id,
      appId: ATLENDIS_V_1_DEFINITION.id,
      network: Network.POLYGON_MAINNET,
      resolveBalances: async ({ contractPosition }) => {
        const underlyingToken = contractPosition.tokens[0];
        const position = contractPosition.dataProps as {
          owner: string;
          amount: string;
          tokenId: string;
        };

        const isOwner = position.owner.toLowerCase() === address.toLowerCase();

        const wad = BigNumber.from('0xde0b6b3a7640000');
        const tokenDecimals = BigNumber.from((10 ** underlyingToken.decimals).toString());

        const balance = isOwner ? BigNumber.from(position.amount).div(wad).mul(tokenDecimals).toString() : '0';
        return [drillBalance(underlyingToken, balance)];
      },
    });
  }

  async getBalances(address: string) {
    const assets = await this.getPositionBalances(address);
    return presentBalanceFetcherResponse([
      {
        label: 'Positions',
        assets,
      },
    ]);
  }
}
