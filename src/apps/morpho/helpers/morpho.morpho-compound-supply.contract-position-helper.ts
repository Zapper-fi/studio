import { Inject, Injectable } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { MorphoContractFactory } from '~apps/morpho';
import { MorphoCompoundLens } from '~apps/morpho/contracts';
import { MorphoCompoundSupplyContractPositionDataProps } from '~apps/morpho/ethereum/morpho.morpho-compound-supply.contract-position-fetcher';
import { MorphoMarketsHelper } from '~apps/morpho/helpers/morpho.markets-helper';
import { MorphoRateHelper } from '~apps/morpho/helpers/morpho.rate-helper';
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types';

export interface MorphoCompoundSupplyContractPositionHelperParams {
  network: Network;
  appId: string;
  groupId: string;
}
export interface BuildContractPositionProps {
  market: string;
  multicall: IMulticallWrapper;
  network: Network;
  lens: MorphoCompoundLens;
}

export interface IMorphoCompoundSupplyContractPositionHelper<T> {
  getMarkets: (params: MorphoCompoundSupplyContractPositionHelperParams) => Promise<ContractPosition<T>[]>;
}
@Injectable()
export class MorphoCompoundSupplyContractPositionHelper
  implements IMorphoCompoundSupplyContractPositionHelper<MorphoCompoundSupplyContractPositionDataProps>
{
  baseContractPosition: Pick<
    ContractPosition<MorphoCompoundSupplyContractPositionDataProps>,
    'type' | 'network' | 'appId' | 'groupId'
  > = {
    type: ContractType.POSITION,
    network: Network.ETHEREUM_MAINNET,
    groupId: '',
    appId: '',
  };
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) private readonly morphoContractFactory: MorphoContractFactory,
    @Inject(MorphoRateHelper) private readonly rateHelper: MorphoRateHelper,
    @Inject(MorphoMarketsHelper) private readonly marketsHelper: MorphoMarketsHelper,
  ) {}

  async getMarkets({ network, appId, groupId }: MorphoCompoundSupplyContractPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const lens = multicall.wrap(
      this.morphoContractFactory.morphoCompoundLens({
        address: '0x930f1b46e1d081ec1524efd95752be3ece51ef67',
        network,
      }),
    );
    await this.marketsHelper.setupMarkets(lens, network, appId);
    this.baseContractPosition = {
      ...this.baseContractPosition,
      network,
      appId,
      groupId,
    };
    const contractPositions = await Promise.all(
      this.marketsHelper.markets.map(market => this._buildMarketPosition({ market, multicall, network, lens })),
    );
    return compact(contractPositions);
  }

  private async _buildMarketPosition({ market, multicall, network, lens }: BuildContractPositionProps) {
    const underlyingDependency = this.marketsHelper.underlyings[market];
    const cToken = multicall.wrap(this.morphoContractFactory.compoundCToken({ address: market, network }));

    const [supplyRateRaw, borrowRateRaw, totalMarketSupplyRaw, poolLiquidityRaw] = await Promise.all([
      lens.getAverageSupplyRatePerBlock(market),
      lens.getAverageBorrowRatePerBlock(market),
      lens.getTotalMarketSupply(market),
      // lens.getTotalMarketBorrow(market),
      cToken.getCash(),
    ]);
    const supplyApy = this.rateHelper.rateToAPY({
      network,
      rate: supplyRateRaw.avgSupplyRatePerBlock,
    });
    const borrowApy = this.rateHelper.rateToAPY({
      network,
      rate: borrowRateRaw.avgBorrowRatePerBlock,
    });
    const price = underlyingDependency.price;
    const liquidity = +formatUnits(poolLiquidityRaw, underlyingDependency.decimals) * price;
    const totalSupply = totalMarketSupplyRaw.p2pSupplyAmount.add(totalMarketSupplyRaw.poolSupplyAmount);
    const supply = +formatUnits(totalSupply, underlyingDependency.decimals);
    const supplyUsd = supply * price;
    const contractPosition: ContractPosition<MorphoCompoundSupplyContractPositionDataProps> = {
      ...this.baseContractPosition,
      address: market,
      tokens: [underlyingDependency],
      dataProps: {
        supplyApy,
        borrowApy,
        liquidity,
        p2pDisabled: underlyingDependency.p2pDisabled,
      },
      displayProps: {
        label: underlyingDependency.symbol,
        labelDetailed: underlyingDependency.symbol,
        secondaryLabel: buildDollarDisplayItem(underlyingDependency.price),
        tertiaryLabel: `${(supplyApy * 100).toFixed(3)}% APY`,
        images: [getTokenImg(underlyingDependency.address, network)],
        statsItems: [
          { label: 'Supply APY', value: buildPercentageDisplayItem(supplyApy * 100) },
          { label: 'Total Supply', value: buildNumberDisplayItem(supply) },
          { label: 'Total USD', value: buildDollarDisplayItem(supplyUsd) },
          { label: 'Price', value: buildDollarDisplayItem(price) },
        ],
        balanceDisplayMode: BalanceDisplayMode.UNDERLYING,
      },
    };
    return contractPosition;
  }
}
