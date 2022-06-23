import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';
import { drillBalance } from '~app-toolkit';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CurvePoolTokenDataProps } from '~apps/curve/helpers/curve.pool.token-helper';
import { BalanceFetcher, MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolContractFactory } from '../contracts';
import { BastionSupplyTokenDataProps } from '../helper/bastion-protocol.supply.token-helper';

const network = Network.AURORA_MAINNET;

type BastionLendingMetaHelperParams = {
  balances: (TokenBalance | ContractPositionBalance)[];
};

@Register.BalanceFetcher(BASTION_PROTOCOL_DEFINITION.id, network)
export class AuroraBastionProtocolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BastionProtocolContractFactory)
    private readonly bastionProtocolContractFactory: BastionProtocolContractFactory,
  ) {}

  async getSupplyBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);

    const supplyTokens = await this.appToolkit.getAppTokenPositions<BastionSupplyTokenDataProps>({
      appId: BASTION_PROTOCOL_DEFINITION.id,
      groupIds: [BASTION_PROTOCOL_DEFINITION.groups.supply.id],
      network,
    });

    const supplyTokenBalances = await Promise.all(
      supplyTokens.map(async supplyToken => {
        const supplyTokenContract = this.bastionProtocolContractFactory.bastionProtocolCtoken({
          address: supplyToken.address,
          network,
        });
        const balanceRaw = await multicall.wrap(supplyTokenContract).balanceOf(address);
        return drillBalance(supplyToken, balanceRaw.toString());
      }),
    );

    return supplyTokenBalances;
  }

  async getBorrowBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);

    const borrowPositions = await this.appToolkit.getAppContractPositions<BastionSupplyTokenDataProps>({
      appId: BASTION_PROTOCOL_DEFINITION.id,
      groupIds: [BASTION_PROTOCOL_DEFINITION.groups.supply.id],
      network,
    });

    const borrowPositionBalances = await Promise.all(
      borrowPositions.map(async borrowPosition => {
        const borrowContract = this.bastionProtocolContractFactory.bastionProtocolCtoken({
          address: borrowPosition.address,
          network,
        });
        const balanceRaw = await multicall.wrap(borrowContract).borrowBalanceCurrent(address);
        const tokens = [drillBalance(borrowPosition.tokens[0], balanceRaw.toString(), { isDebt: true })];
        return { ...borrowPosition, tokens, balanceUSD: tokens[0].balanceUSD };
      }),
    );

    return borrowPositionBalances;
  }

  async getSwapBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);

    const swapTokens = await this.appToolkit.getAppTokenPositions<CurvePoolTokenDataProps>({
      appId: BASTION_PROTOCOL_DEFINITION.id,
      groupIds: [BASTION_PROTOCOL_DEFINITION.groups.swap.id],
      network,
    });

    const swapTokenBalances = await Promise.all(
      swapTokens.map(async swapToken => {
        const supplyTokenContract = this.bastionProtocolContractFactory.bastionProtocolCtoken({
          address: swapToken.address,
          network,
        });
        const balanceRaw = await multicall.wrap(supplyTokenContract).balanceOf(address);
        return drillBalance(swapToken, balanceRaw.toString());
      }),
    );

    return swapTokenBalances;
  }

  getMeta({ balances }: BastionLendingMetaHelperParams) {
    const collaterals = balances.filter(balance => balance.balanceUSD > 0);
    const debt = balances.filter(balance => balance.balanceUSD < 0);
    const totalCollateralUSD = sumBy(collaterals, a => a.balanceUSD);
    const totalDebtUSD = sumBy(debt, a => a.balanceUSD);
    const utilRatio = (Math.abs(totalDebtUSD) / totalCollateralUSD) * 100;

    const meta: MetadataItemWithLabel[] = [
      {
        label: 'Collateral',
        value: totalCollateralUSD,
        type: 'dollar',
      },
      {
        label: 'Debt',
        value: totalDebtUSD,
        type: 'dollar',
      },
      {
        label: 'Utilization Rate',
        value: utilRatio,
        type: 'pct',
      },
    ];

    return meta;
  }

  async getBalances(address: string) {
    const [supplyBalances, borrowBalances, swapBalances] = await Promise.all([
      this.getSupplyBalances(address),
      this.getBorrowBalances(address),
      this.getSwapBalances(address),
    ]);

    const meta = this.getMeta({ balances: [...supplyBalances, ...borrowBalances] });
    const lendingProduct = { label: 'Lending', assets: [...supplyBalances, ...borrowBalances], meta };
    const swapProduct = { label: 'Stableswap', assets: [...swapBalances] };

    return presentBalanceFetcherResponse([lendingProduct, swapProduct]);
  }
}
