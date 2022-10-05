import { Inject } from '@nestjs/common';
import { sumBy, findIndex } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, WithMetaType } from '~position/display.interface';
import {
  AppTokenPositionBalance,
  BaseTokenBalance,
  ContractPositionBalance,
} from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { MeanFinanceContractFactory } from '../contracts';
import {
  ERC4626WRAP_ADDRESSES,
  HUB_ADDRESS,
  POSITIONS_VERSIONS,
  PositionVersions,
  POSITION_VERSION_4,
  TRANSFORMER_REGISTRY_ADDRESS,
} from '../helpers/addresses';
import { getUserPositions } from '../helpers/graph';
import { STRING_SWAP_INTERVALS } from '../helpers/intervals';
import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(MEAN_FINANCE_DEFINITION.id, network)
export class PolygonMeanFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MeanFinanceContractFactory)
    private readonly meanFinanceContractFactory: MeanFinanceContractFactory,
  ) {}

  async getUserPositions(address: string, version: PositionVersions) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await getUserPositions(address.toLocaleLowerCase(), Network.POLYGON_MAINNET, graphHelper, version);
    return data.positions;
  }

  async getBalanceForVersion(address: string, version: PositionVersions) {
    const positions = await this.getUserPositions(address, version);
    const dcaHubAddress = HUB_ADDRESS[version][network];

    if (!dcaHubAddress) {
      return Promise.resolve([]);
    }

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: 'aave-v3',
      groupIds: ['supply'],
      network,
    });

    const allTokens = [...baseTokens, ...appTokens];

    const amountsToFetch: { tokenFrom: string; tokenTo: string; amount: string; positionId: string }[] = [];

    const mappedPositions = positions.map(dcaPosition => {
      const toWithdraw = dcaPosition.toWithdraw;
      const remainingLiquidity = dcaPosition.remainingLiquidity;
      const remainingSwaps = Number(dcaPosition.remainingSwaps);
      const swapInterval = Number(dcaPosition.swapInterval.interval) as keyof typeof STRING_SWAP_INTERVALS;
      const rawRate = dcaPosition.depositedRateUnderlying || dcaPosition.rate;
      const hasYieldFrom = !!dcaPosition.from.underlyingTokens.length;
      const hasYieldTo = !!dcaPosition.to.underlyingTokens.length;
      const fromToUse = hasYieldFrom ? dcaPosition.from.underlyingTokens[0] : dcaPosition.from;
      const toToUse = hasYieldTo ? dcaPosition.to.underlyingTokens[0] : dcaPosition.to;

      const fromIsWrappedToken = !!ERC4626WRAP_ADDRESSES[network][dcaPosition.from.address];
      const toIsWrappedToken = !!ERC4626WRAP_ADDRESSES[network][dcaPosition.to.address];

      const tokenFromToSearch =
        hasYieldFrom && fromIsWrappedToken
          ? ERC4626WRAP_ADDRESSES[network][dcaPosition.from.address]
          : dcaPosition.from.address;
      const tokenToToSearch =
        hasYieldTo && toIsWrappedToken
          ? ERC4626WRAP_ADDRESSES[network][dcaPosition.to.address]
          : dcaPosition.to.address;

      const rate = Number(rawRate) / 10 ** Number(fromToUse.decimals);
      let formattedRate = rate.toFixed(3);

      if (rate < 0.001) {
        formattedRate = '<0.001';
      }

      const from = allTokens.find(v => v.address.toLowerCase() === tokenFromToSearch.toLowerCase());
      const to = allTokens.find(v => v.address.toLowerCase() === tokenToToSearch.toLowerCase());

      const tokens: WithMetaType<BaseTokenBalance | AppTokenPositionBalance<DefaultDataProps>>[] = [];
      let images: string[] = [];
      if (from) {
        from.network = network;
        tokens.push(drillBalance(from, remainingLiquidity));
        images = [...images, ...getImagesFromToken(from)];

        if (fromIsWrappedToken) {
          amountsToFetch.push({
            tokenFrom: dcaPosition.from.address,
            tokenTo: from.address,
            amount: remainingLiquidity,
            positionId: `${dcaPosition.id}-v${version}`,
          });
        }
      }
      if (to) {
        to.network = network;
        tokens.push(drillBalance(claimable(to), toWithdraw));
        images = [...images, ...getImagesFromToken(to)];
        if (toIsWrappedToken) {
          amountsToFetch.push({
            tokenFrom: dcaPosition.to.address,
            tokenTo: to.address,
            amount: toWithdraw,
            positionId: `${dcaPosition.id}-v${version}`,
          });
        }
      }

      const balanceUSD = sumBy(tokens, t => t.balanceUSD);
      const swapIntervalAdverb = STRING_SWAP_INTERVALS[swapInterval].adverb;
      let label = '';

      if (remainingSwaps > 0) {
        label = `Swapping ~${formattedRate} ${fromToUse.symbol}${
          hasYieldFrom ? ' + yield' : ''
        } ${swapIntervalAdverb} to ${toToUse.symbol}`;
      } else {
        label = `Swapping ${fromToUse.symbol} to ${toToUse.symbol}`;
      }
      const secondaryLabel =
        remainingSwaps && STRING_SWAP_INTERVALS[swapInterval]
          ? `${STRING_SWAP_INTERVALS[swapInterval].plural(remainingSwaps)} left`
          : 'Position finished';

      const position: ContractPositionBalance = {
        type: ContractType.POSITION,
        address: dcaHubAddress,
        appId: MEAN_FINANCE_DEFINITION.id,
        groupId: MEAN_FINANCE_DEFINITION.groups.dcaPosition.id,
        network,
        tokens,
        balanceUSD,
        dataProps: {
          id: `${dcaPosition.id}-v${version}`,
          positionId: dcaPosition.id,
          toWithdraw,
          remainingLiquidity,
          remainingSwaps,
          totalValueLocked: balanceUSD,
        },
        displayProps: {
          label,
          secondaryLabel,
          images,
        },
      };

      position.key = this.appToolkit.getPositionKey(position, ['id']);
      return position;
    });

    const multicall = this.appToolkit.getMulticall(network);

    const transformerAddress = TRANSFORMER_REGISTRY_ADDRESS[POSITION_VERSION_4][network];

    if (!transformerAddress || !amountsToFetch.length) {
      return mappedPositions;
    }

    const contract = this.meanFinanceContractFactory.meanFinanceTransformerRegistry({
      address: transformerAddress,
      network,
    });

    const amountToFetchResults = await Promise.all(
      amountsToFetch.map(({ tokenFrom, amount }) =>
        multicall.wrap(contract).calculateTransformToUnderlying(tokenFrom, amount),
      ),
    );

    amountToFetchResults.forEach(([{ amount }], index) => {
      const positionToChange = amountsToFetch[index];

      const foundPositionIndex = findIndex(mappedPositions, { dataProps: { id: positionToChange.positionId } });

      if (foundPositionIndex === -1) {
        return;
      }

      const tokenToReplaceIndex = findIndex(mappedPositions[foundPositionIndex].tokens, {
        address: positionToChange.tokenTo,
      });

      if (tokenToReplaceIndex === -1) {
        return;
      }

      mappedPositions[foundPositionIndex].tokens[tokenToReplaceIndex] = drillBalance(
        mappedPositions[foundPositionIndex].tokens[tokenToReplaceIndex],
        amount.toString(),
      );

      const balanceUSD = sumBy(mappedPositions[foundPositionIndex].tokens, t => t.balanceUSD);

      mappedPositions[foundPositionIndex].balanceUSD = balanceUSD;
    });

    return mappedPositions;
  }

  async getBalances(address: string) {
    const positionResults = await Promise.all(
      POSITIONS_VERSIONS.map(version => this.getBalanceForVersion(address, version)),
    );

    const contractPositionBalances: ContractPositionBalance[] = positionResults.reduce(
      (acc, positionBalances) => [...acc, ...positionBalances],
      [],
    );

    return presentBalanceFetcherResponse([
      {
        label: 'DCA Positions',
        assets: contractPositionBalances,
      },
    ]);
  }
}
