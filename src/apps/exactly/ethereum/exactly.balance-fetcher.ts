import { Inject } from '@nestjs/common';
import { BigNumber, constants } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { WithMetaType } from '~position/display.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { Token } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ExactlyContractFactory } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';
import { ExactlyTokenDataProps } from '../helpers/exactly.template.token-fetcher';

import { PREVIEWER_ADDRESS } from './constants';

const network = Network.ETHEREUM_MAINNET;
const appId = EXACTLY_DEFINITION.id;

@Register.BalanceFetcher(appId, network)
export class EthereumExactlyBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ExactlyContractFactory) private readonly contractFactory: ExactlyContractFactory,
  ) {}

  async getMarketsData(address: string) {
    const multicall = this.appToolkit.getMulticall(network);

    const previewer = multicall.wrap(
      this.contractFactory.previewer({
        address: PREVIEWER_ADDRESS,
        network,
      }),
    );

    return multicall.wrap(previewer).exactly(address);
  }

  async getFixedDepositBalances(address: string) {
    const marketsData = await this.getMarketsData(address);
    const balances = await Promise.all(
      marketsData.map(async ({ fixedDepositPositions, asset }) => {
        const baseToken = await this.appToolkit.getBaseTokenPrice({ address: asset.toLowerCase(), network });

        if (!baseToken) return null;

        const total = fixedDepositPositions.reduce(
          (acc, { position: { principal, fee } }) => acc.add(principal).add(fee),
          BigNumber.from(0),
        );

        return drillBalance(baseToken as WithMetaType<Token>, total.toString());
      }),
    );
    return balances.filter(Boolean) as WithMetaType<Token>[];
  }

  async getFixedBorrowBalances(address: string) {
    const marketsData = await this.getMarketsData(address);
    const balances = await Promise.all(
      marketsData.map(async ({ fixedBorrowPositions, penaltyRate, asset }) => {
        const baseToken = await this.appToolkit.getBaseTokenPrice({ address: asset.toLowerCase(), network });
        if (!baseToken) return null;

        const totalPositions = fixedBorrowPositions.reduce((acc, { maturity, position: { principal, fee } }) => {
          const timeElapsed = Math.floor(Date.now() / 1000) - maturity.toNumber();
          const penalties =
            timeElapsed > 0
              ? principal.add(fee).mul(penaltyRate).mul(timeElapsed).div(constants.WeiPerEther)
              : BigNumber.from(0);

          return acc.add(principal).add(fee).add(penalties);
        }, BigNumber.from(0));

        return drillBalance(baseToken as WithMetaType<Token>, totalPositions.toString(), { isDebt: true });
      }),
    );
    return balances.filter(Boolean) as WithMetaType<Token>[];
  }

  async getVariableBorrowBalances(address: string) {
    const marketsData = await this.getMarketsData(address);

    const balances = await Promise.all(
      marketsData.map(async ({ floatingBorrowAssets, asset }) => {
        const baseToken = await this.appToolkit.getBaseTokenPrice({ address: asset.toLowerCase(), network });
        if (!baseToken) return null;
        return drillBalance(baseToken as WithMetaType<Token>, floatingBorrowAssets.toString(), { isDebt: true });
      }),
    );
    return balances.filter(Boolean) as WithMetaType<Token>[];
  }

  async getDepositBalances(address: string) {
    return Promise.all([
      this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
        address,
        appId,
        groupId: EXACTLY_DEFINITION.groups.deposit.id,
        network: Network.ETHEREUM_MAINNET,
      }),
      this.getFixedDepositBalances(address),
    ]).then(v => v.flat());
  }

  async getBorrowBalances(address: string) {
    return Promise.all([this.getVariableBorrowBalances(address), this.getFixedBorrowBalances(address)]).then(v =>
      v.flat(),
    );
  }

  async getBalances(address: string) {
    const [deposits, borrows] = await Promise.all([this.getDepositBalances(address), this.getBorrowBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Deposited',
        assets: deposits as AppTokenPositionBalance<ExactlyTokenDataProps>[],
      },
      {
        label: 'Borrowed',
        assets: borrows as AppTokenPositionBalance<ExactlyTokenDataProps>[],
      },
    ]);
  }
}
