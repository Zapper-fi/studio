import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { UMAMI_FINANCE_DEFINITION } from '~apps/umami-finance';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { VendorFinanceContractFactory } from '../contracts';
import { VENDOR_GRAPH_URL } from '../graphql/constants';
import { lendingPoolsQuery, VendorLendingPoolsGraphResponse } from '../graphql/getLendingPoolsQuery';
import { VENDOR_FINANCE_DEFINITION } from '../vendor-finance.definition';

const appId = VENDOR_FINANCE_DEFINITION.id;
const groupId = VENDOR_FINANCE_DEFINITION.groups.pools.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumVendorFinancePoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VendorFinanceContractFactory) private readonly vendorFinanceContractFactory: VendorFinanceContractFactory,
  ) {}

  async getPositions() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph<VendorLendingPoolsGraphResponse>({
      endpoint: VENDOR_GRAPH_URL,
      query: lendingPoolsQuery,
    });
    if (!data) return [];
    const pools = data.pools;
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const umamiTokens = await this.appToolkit.getAppTokenPositions({
      appId: UMAMI_FINANCE_DEFINITION.id,
      groupIds: [UMAMI_FINANCE_DEFINITION.groups.compound.id],
      network,
    });
    const allTokens = [...baseTokens, ...umamiTokens];
    const poolsPositions: Array<ContractPosition> = [];
    pools.forEach(
      ({ id, _colToken, _lendToken, _deployer, _expiry, _mintRatio, _feeRate, _totalBorrowed, _lendBalance }) => {
        const collateralToken = allTokens.find(({ address }) => address === _colToken);
        const lentToken = allTokens.find(({ address }) => address === _lendToken);

        if (!collateralToken || !lentToken) return [];

        const statsItems = [
          {
            label: 'Lending APR',
            value: buildPercentageDisplayItem(parseInt(_feeRate, 10) / 10000),
          },
          {
            label: 'LTV',
            value: parseInt(_mintRatio, 10) / 10 ** 18,
          },
          {
            label: 'Repayment date',
            value: new Date(parseInt(_expiry, 10) * 1000).toDateString(),
          },
          {
            label: 'Available',
            value: buildDollarDisplayItem((parseInt(_lendBalance, 10) / 10 ** lentToken.decimals) * lentToken.price),
          },
          {
            label: 'Borrowed',
            value: buildDollarDisplayItem((parseInt(_totalBorrowed, 10) / 10 ** lentToken.decimals) * lentToken.price),
          },
        ];

        const dateString = new Date(parseInt(_expiry, 10) * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        poolsPositions.push({
          address: id,
          type: ContractType.POSITION,
          network,
          appId: VENDOR_FINANCE_DEFINITION.id,
          groupId: VENDOR_FINANCE_DEFINITION.groups.pools.id,
          tokens: [supplied(collateralToken), borrowed(lentToken)],
          dataProps: {
            deployer: _deployer,
          },
          displayProps: {
            label: `${collateralToken.symbol}/${lentToken.symbol} lending pool - ${dateString}`,
            images: [getTokenImg(collateralToken.address, network), getTokenImg(lentToken.address, network)],
            statsItems,
          },
        });
      },
    );

    return _.compact(poolsPositions);
  }
}
