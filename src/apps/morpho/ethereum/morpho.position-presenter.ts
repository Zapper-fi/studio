import { Inject } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MorphoContractPositionDataProps } from '~apps/morpho/helpers/position-fetcher.common';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { MorphoContractFactory } from '../contracts';

export type EthereumMorphoPositionPresenterDataProps =
  | EthereumMorphoPositionPresenterLendingDataProps
  | EthereumMorphoPositionPresenterHealthFactorDataProps;

export type EthereumMorphoPositionPresenterLendingDataProps = {
  type: 'lending';
  collateral: number;
  debt: number;
  maxDebt: number;
  liquidationThreshold: number;
};

export type EthereumMorphoPositionPresenterHealthFactorDataProps = {
  type: 'health-factor';
  healthFactor: number;
};

@PresenterTemplate()
export class EthereumMorphoPositionPresenter extends PositionPresenterTemplate<EthereumMorphoPositionPresenterDataProps> {
  morphoCompoundLensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
  morphoAaveLensAddress = '0x507fa343d0a90786d86c7cd885f5c49263a91ff4';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) protected readonly contractFactory: MorphoContractFactory,
  ) {
    super();
  }

  async positionDataProps({
    address,
    groupLabel,
    balances,
  }: {
    address: string;
    groupLabel: string;
    balances: ReadonlyBalances;
  }): Promise<EthereumMorphoPositionPresenterDataProps | undefined> {
    switch (groupLabel) {
      case 'Morpho Aave': {
        const healthFactor = await this.getMorphoAaveHealthFactor(address);
        if (!healthFactor) return;
        return { type: 'health-factor', healthFactor };
      }
      case 'Morpho Compound': {
        const lendingDataProps = await this.getMorphoCompoundLending(address, balances);
        if (!lendingDataProps) return;
        return { type: 'lending', ...lendingDataProps };
      }
      default:
        return;
    }
  }

  presentDataProps(dataProps: EthereumMorphoPositionPresenterDataProps): MetadataItemWithLabel[] {
    switch (dataProps.type) {
      case 'health-factor': {
        const { healthFactor } = dataProps;
        return [
          {
            label: 'Health Factor',
            value: healthFactor,
            type: 'number',
          },
        ];
      }
      case 'lending': {
        const { maxDebt, collateral, debt, liquidationThreshold } = dataProps;
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
            value: liquidationThreshold,
            type: 'pct',
          },
        ];
      }
      default:
        return [];
    }
  }

  private async getMorphoAaveHealthFactor(address: string) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const lens = this.contractFactory.morphoAaveV2Lens({
      address: this.morphoAaveLensAddress,
      network: this.network,
    });
    const healthFactor = await multicall
      .wrap(lens)
      .getUserHealthFactor(address)
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return undefined;
        throw err;
      });
    if (!healthFactor) return;
    return +formatUnits(healthFactor);
  }

  private async getMorphoCompoundLending(address: string, balances: ReadonlyBalances) {
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
        if (isMulticallUnderlyingError(err)) return undefined;
        throw err;
      });
    if (!balanceStates) return;

    const { collateralValue, debtValue, maxDebtValue } = balanceStates;

    const collateral = +formatUnits(collateralValue);
    const debt = +formatUnits(debtValue);
    const maxDebt = +formatUnits(maxDebtValue);
    const liquidationThreshold = maxDebt > 0 ? (debt / maxDebt) * 100 : 0;
    return { collateral, debt, maxDebt, liquidationThreshold };
  }
}
