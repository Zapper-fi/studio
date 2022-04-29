import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory } from '../contracts';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

import { QiDaoVaultPositionDataProps } from './qi-dao.vault.position-helper';

export type QiDaoVaultPositionBalanceHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class QiDaoVaultPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) private readonly contractFactory: QiDaoContractFactory,
  ) {}

  async getPositionBalances({ address, network }: QiDaoVaultPositionBalanceHelperParams) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances<QiDaoVaultPositionDataProps>(
      {
        network,
        appId: QI_DAO_DEFINITION.id,
        groupId: QI_DAO_DEFINITION.groups.vault.id,
        address,
        resolveBalances: async ({ contractPosition: position, multicall }) => {
          const collateralToken = position.tokens.find(isSupplied)!;
          const borrowedToken = position.tokens.find(isBorrowed)!;

          const vaultNftContract = this.contractFactory.qiDaoVaultNft({
            address: position.address,
            network,
          });

          const vaultContract = this.contractFactory.qiDaoVaultInfo({
            address: position.dataProps.vaultInfoAddress,
            network,
          });

          const numOfVaults = await multicall.wrap(vaultNftContract).balanceOf(address).then(Number);
          if (numOfVaults === 0) return [drillBalance(collateralToken, '0'), drillBalance(borrowedToken, '0')];

          const indices = await Promise.all(
            range(0, numOfVaults).map(i => multicall.wrap(vaultNftContract).tokenOfOwnerByIndex(address, i)),
          );

          const balances = await Promise.all(
            range(0, indices.length).map(async i => {
              const [collateralBalanceRaw, debtBalanceRaw] = await Promise.all([
                multicall
                  .wrap(vaultContract)
                  .vaultCollateral(indices[i])
                  .then(v => v.toString()),
                multicall
                  .wrap(vaultContract)
                  .vaultDebt(indices[i])
                  .then(v => v.toString()),
              ]);

              return {
                collateralBalanceRaw,
                debtBalanceRaw,
              };
            }),
          );

          const collateralBalanceRaw = balances
            .map(balance => balance.collateralBalanceRaw)
            .reduce((acc, v) => acc.plus(v), new BigNumber(0))
            .toFixed(0);

          const debtBalanceRaw = balances
            .map(balance => balance.debtBalanceRaw)
            .reduce((acc, v) => acc.plus(v), new BigNumber(0))
            .toFixed(0);

          return [
            drillBalance(collateralToken, collateralBalanceRaw),
            drillBalance(borrowedToken, debtBalanceRaw, { isDebt: true }),
          ];
        },
      },
    );
  }
}
