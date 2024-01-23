import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { compact, merge, reduce, sumBy, uniqBy } from 'lodash';
import { duration } from 'moment';
import 'moment-duration-format';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { MeanFinanceViemContractFactory } from '../contracts';
import { MeanFinancePermissionManager } from '../contracts/viem';

import { GET_USER_POSITIONS, GET_POSITIONS, MeanFinancePosition } from './mean-finance.dca-position.queries';

type MeanFinanceDcaPositionDefinition = {
  address: string;
  hubAddress: string;
  fromTokenAddress: string;
  fromLiquidity: string;
  toTokenAddress: string;
  toLiquidity: string;
};

type MeanFinanceDcaPositionDataProps = {
  liquidity: number;
  assetStandard: Standard;
  tokenId?: string;
};

export type HubConfiguration = {
  hubAddress: string;
  tokenAddress: string;
  subgraphUrl: string;
  transformerAddress?: string;
};

export abstract class MeanFinanceDcaPositionContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  MeanFinancePermissionManager,
  MeanFinanceDcaPositionDataProps,
  MeanFinanceDcaPositionDefinition
> {
  abstract hubs: HubConfiguration[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MeanFinanceViemContractFactory) protected readonly contractFactory: MeanFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.meanFinancePermissionManager({ address, network: this.network });
  }

  async getDefinitions() {
    const allPositions = await Promise.all(
      this.hubs.map(async ({ tokenAddress, hubAddress, subgraphUrl }) => {
        const positionData = await gqlFetchAll<MeanFinancePosition>({
          endpoint: subgraphUrl,
          query: GET_POSITIONS,
          variables: {},
          dataToSearch: 'positions',
        });

        const directionsAndLiquidity = positionData.positions.map(v => ({
          fromTokenAddress: (v.from.underlyingTokens[0]?.address ?? v.from.address)
            .toLowerCase()
            .replace(ETH_ADDR_ALIAS, ZERO_ADDRESS),
          toTokenAddress: (v.to.underlyingTokens[0]?.address ?? v.to.address)
            .toLowerCase()
            .replace(ETH_ADDR_ALIAS, ZERO_ADDRESS),
          fromLiquidity: v.remainingLiquidity,
          toLiquidity: v.toWithdraw,
        }));

        // @TODO I'd prefer this to be done with a DataLoader in the `getDataProps` method.
        const uniqueDirections = uniqBy(directionsAndLiquidity, v => `${v.fromTokenAddress}:${v.toTokenAddress}`);
        const uniqueDirectionsWithLiquidity = uniqueDirections.map(direction => {
          const positions = directionsAndLiquidity
            .filter(d2 => d2.fromTokenAddress === direction.fromTokenAddress)
            .filter(d2 => d2.toTokenAddress === direction.toTokenAddress);
          const fromLiquidityBN = reduce(positions, (acc, v) => acc.add(v.fromLiquidity), BigNumber.from(0));
          const toLiquidityBN = reduce(positions, (acc, v) => acc.add(v.toLiquidity), BigNumber.from(0));

          const fromLiquidity = fromLiquidityBN.toString();
          const toLiquidity = toLiquidityBN.toString();
          return { ...direction, fromLiquidity, toLiquidity };
        });

        return uniqueDirectionsWithLiquidity.map(v => ({ address: tokenAddress, hubAddress, ...v }));
      }),
    );

    return allPositions.flat();
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<MeanFinancePermissionManager, MeanFinanceDcaPositionDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.fromTokenAddress, network: this.network },
      { metaType: MetaType.CLAIMABLE, address: definition.toTokenAddress, network: this.network },
    ];
  }

  async getDataProps({
    definition,
    contractPosition,
  }: GetDataPropsParams<
    MeanFinancePermissionManager,
    MeanFinanceDcaPositionDataProps,
    MeanFinanceDcaPositionDefinition
  >): Promise<MeanFinanceDcaPositionDataProps> {
    const fromLiquidity = Number(definition.fromLiquidity) / 10 ** contractPosition.tokens[0].decimals;
    const toLiquidity = Number(definition.toLiquidity) / 10 ** contractPosition.tokens[1].decimals;
    const liquidity = fromLiquidity + toLiquidity;
    return { liquidity, assetStandard: Standard.ERC_721 };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<MeanFinancePermissionManager>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} to ${getLabelFromToken(contractPosition.tokens[1])}`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<MeanFinanceDcaPositionDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const positions = await this.appToolkit.getAppContractPositions<MeanFinanceDcaPositionDataProps>({
      network: this.network,
      appId: this.appId,
      groupIds: [this.groupId],
    });

    const allUserPositions = await Promise.all(
      this.hubs.map(async ({ transformerAddress, subgraphUrl }) => {
        const userPositionsData = await gqlFetchAll<MeanFinancePosition>({
          endpoint: subgraphUrl,
          query: GET_USER_POSITIONS,
          variables: { address },
          dataToSearch: 'positions',
        });

        const userPositions = await Promise.all(
          userPositionsData.positions.map(async userPos => {
            const hasYield = userPos.from.underlyingTokens.length > 0;
            const fromTokenAddress = (userPos.from.underlyingTokens[0]?.address ?? userPos.from.address)
              .toLowerCase()
              .replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
            const toTokenAddress = (userPos.to.underlyingTokens[0]?.address ?? userPos.to.address)
              .toLowerCase()
              .replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);

            const position = positions
              .filter(v => v.tokens[0].address === fromTokenAddress)
              .find(v => v.tokens[1].address === toTokenAddress);
            if (!position) return null;

            let fromBalanceRaw = userPos.remainingLiquidity;
            const toBalanceRaw = userPos.toWithdraw;

            // Handle yield token amounts by converting to the underlying token amount
            if (hasYield && transformerAddress) {
              const transformerContract = this.contractFactory.meanFinanceTransformerRegistry({
                address: transformerAddress,
                network: this.network,
              });

              const amountTransformedToUnderlying = await multicall
                .wrap(transformerContract)
                .read.calculateTransformToUnderlying([userPos.from.address, BigInt(fromBalanceRaw)]);
              fromBalanceRaw = amountTransformedToUnderlying[0].amount.toString();
            }

            const [fromToken, toToken] = position.tokens;
            const tokens = [drillBalance(fromToken, fromBalanceRaw), drillBalance(toToken, toBalanceRaw)];
            const balanceUSD = sumBy(tokens, v => v.balanceUSD);

            // Data Props
            const tokenId = userPos.id;
            const swapInterval = Number(userPos.swapInterval.interval);
            const remainingSwaps = Number(userPos.remainingSwaps);
            const rate = Number(userPos.depositedRateUnderlying || userPos.rate) / 10 ** Number(fromToken.decimals);
            const dataProps = { tokenId, hasYield, rate, remainingSwaps, swapInterval, positionKey: userPos.id };

            // Display Properties
            const formattedRate = rate < 0.001 ? '<0.001' : rate.toFixed(3);
            const intervalMoment = duration(swapInterval, 'seconds');
            const remainingMoment = duration(remainingSwaps * swapInterval, 'seconds');
            const intervalLabel = intervalMoment.format('w [weeks], d [days], h [hours], m [minutes]', { trim: 'all' });
            const remainingLabel = remainingMoment.format('w [weeks], d [days], h [hours], m [minutes]', {
              trim: 'all',
            });
            const label = `Swapping ~${formattedRate}${getLabelFromToken(fromToken)}${hasYield ? ' with yield' : ''}${
              remainingSwaps > 0 ? ` every ${intervalLabel}` : ''
            } to ${getLabelFromToken(toToken)}`;
            const secondaryLabel = remainingSwaps > 0 ? `${remainingLabel} remaining` : 'Position finished';
            const displayProps = { label, secondaryLabel };

            const positionBalance = merge({}, position, {
              tokens,
              balanceUSD,
              dataProps,
              displayProps,
            });

            return positionBalance;
          }),
        );

        return userPositions;
      }),
    );

    return compact(allUserPositions.flat());
  }
}
