import { Inject, Injectable } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { MorphoContractPositionDataProps } from '~apps/morpho/helpers/position-fetcher.common';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';
import { Network } from '~types';

import { MorphoContractFactory } from '../contracts';
import MORPHO_DEFINITION from '../morpho.definition';

@Injectable()
export class EthereumMorphoPositionPresenter extends PositionPresenterTemplate {
  network = Network.ETHEREUM_MAINNET;
  appId = MORPHO_DEFINITION.id;

  morphoCompoundLensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
  morphoAaveLensAddress = '0x507fa343d0a90786d86c7cd885f5c49263a91ff4';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) protected readonly contractFactory: MorphoContractFactory,
  ) {
    super();
  }

  @Register.BalanceProductMeta('Morpho Aave')
  async getMorphoAaveMeta(address: string) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const lens = this.contractFactory.morphoAaveV2Lens({
      address: this.morphoAaveLensAddress,
      network: this.network,
    });
    const healthFactor = await multicall
      .wrap(lens)
      .getUserHealthFactor(address)
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return null;
        throw err;
      });
    if (!healthFactor) return [];
    return [
      {
        label: 'Health Factor',
        value: +formatUnits(healthFactor),
        type: 'number',
      },
    ];
  }

  @Register.BalanceProductMeta('Morpho Compound')
  async getMorphoCompoundMeta(address: string, balances: ReadonlyBalances) {
    const markets = (balances as ContractPositionBalance<MorphoContractPositionDataProps>[]).map(
      v => v.dataProps.marketAddress,
    );

    const multicall = this.appToolkit.getMulticall(this.network);
    const lens = this.contractFactory.morphoCompoundLens({
      address: this.morphoCompoundLensAddress,
      network: this.network,
    });
    const balanceStates = await multicall
      .wrap(lens)
      .getUserBalanceStates(address, uniq(markets))
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return null;
        throw err;
      });
    if (!balanceStates) return [];

    const { collateralValue, debtValue, maxDebtValue } = balanceStates;

    const maxDebt = +formatUnits(maxDebtValue);
    return this._presentMeta({
      collateral: +formatUnits(collateralValue),
      debt: +formatUnits(debtValue),
      maxDebt,
      liquidationThreshold: maxDebt,
    });
  }

  private _presentMeta({
    collateral,
    debt,
    maxDebt,
    liquidationThreshold,
  }: {
    collateral: number;
    debt: number;
    maxDebt: number;
    liquidationThreshold: number;
  }) {
    return [
      {
        label: 'Collateral',
        value: maxDebt,
        type: 'dollar',
      },
      {
        label: 'Total Supply',
        value: collateral,
        type: 'dollar',
      },
      {
        label: 'Debt',
        value: debt,
        type: 'dollar',
      },
      {
        label: 'Utilization Rate',
        value: liquidationThreshold > 0 ? (debt / liquidationThreshold) * 100 : 0,
        type: 'pct',
      },
    ];
  }
}
