import { Inject } from '@nestjs/common';
import axios from 'axios';
import { BigNumber } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Token } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SingleContractFactory } from '../contracts';
import { WMasterChef } from '../contracts/ethers';
import { SINGLE_DEFINITION } from '../single.definition';
import { SinglePositionApi } from '../types';

import { BASE_API_URL } from './common';

const appId = SINGLE_DEFINITION.id;
const network = Network.CRONOS_MAINNET;

@Register.BalanceFetcher(SINGLE_DEFINITION.id, network)
export class CronosSingleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SingleContractFactory) private readonly singleContractFactory: SingleContractFactory,
  ) {}

  async getVaultTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: SINGLE_DEFINITION.groups.lending.id,
      network,
    });
  }

  async getLyfBalances(address: string) {
    const positions = await axios
      .get<{ data: SinglePositionApi[] }>(`${BASE_API_URL}/positions?owner=${address}&chainid=25`)
      .then(v => v.data.data)
      .then(vs => vs.filter(v => !v.closedAt));

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId: SINGLE_DEFINITION.groups.lyf.id,
      network,
      resolveBalances: async ({ address: _address, contractPosition, multicall }) => {
        const suppliedToken: Token = contractPosition.tokens.find(isSupplied)!;

        const positionsSplitByWMCs: Record<string, SinglePositionApi[]> = positions
          .filter(v => v.lpAddress.toLowerCase() === suppliedToken.address)
          .reduce((prev, v) => ({ ...prev, [v.wmasterchef]: [...(prev[v.wmasterchef] || []), v] }), {});

        if (!Object.keys(positionsSplitByWMCs).length) return [];

        const lpBalance = await Promise.all(
          Object.keys(positionsSplitByWMCs).map(async key => {
            const wMasterChef = this.singleContractFactory.wMasterChef({ address: key, network }) as WMasterChef;
            const lpBalances = await Promise.all(
              positionsSplitByWMCs[key].map(v =>
                multicall.wrap(wMasterChef).collSizeToLpBalance(v.collId, v.collateralSize),
              ),
            );

            return lpBalances.reduce((accu, v) => v.add(accu), BigNumber.from(0));
          }),
        ).then(vs => vs.reduce((accu, v) => v.add(accu), BigNumber.from(0)));

        return [drillBalance(suppliedToken, lpBalance.toString())];
      },
    });
  }

  async getBalances(address: string) {
    const [vaultsTokenBalances, lyfBalances] = await Promise.all([
      this.getVaultTokenBalances(address),
      this.getLyfBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: vaultsTokenBalances,
      },
      {
        label: 'LYF',
        assets: lyfBalances,
      },
    ]);
  }
}
