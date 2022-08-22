import { Inject, Injectable } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { AaveV2ContractFactory } from '~apps/aave-v2';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';
import { Network } from '~types';

import { AAVE_AMM_DEFINITION } from '../aave-amm.definition';

@Injectable()
export class EthereumAaveAmmPositionPresenter extends PositionPresenterTemplate {
  constructor(@Inject(AaveV2ContractFactory) private readonly aaveV2ContractFactory: AaveV2ContractFactory) {
    super();
  }

  appId = AAVE_AMM_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;
  lendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';

  private async getHealthFactor(address: string) {
    const lendingPoolContract = this.aaveV2ContractFactory.aaveV2LendingPoolProvider({
      network: this.network,
      address: this.lendingPoolAddress,
    });

    const lendingPoolUserData = await lendingPoolContract.getUserAccountData(address);
    return lendingPoolUserData.healthFactor;
  }

  @Register.BalanceProductMeta('Lending')
  async getLendingMeta(address: string, balances: ReadonlyBalances) {
    // When no debt, no health factor
    if (!balances.some(balance => balance.balanceUSD < 0)) return [];
    const healthFactor = await this.getHealthFactor(address);

    return [
      {
        label: 'Health Factor',
        value: Number(healthFactor) / 10 ** 18,
        type: 'number',
      },
    ];
  }
}
