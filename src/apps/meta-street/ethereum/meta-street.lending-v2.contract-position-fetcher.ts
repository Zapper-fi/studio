import { Inject } from '@nestjs/common';
import { BigNumberish, BigNumber, constants } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { MetaStreetViemContractFactory } from '../contracts';
import { PoolV2 } from '../contracts/viem';

export const GET_POOLS_QUERY = gql`
  {
    pools(where: { implementationVersionMajor_not: "1" }) {
      id
      ticks {
        id
        limit
        duration
        rate
        raw
      }
      currencyToken {
        symbol
      }
      collateralToken {
        name
      }
    }
  }
`;

export type GetPoolsResponse = {
  pools: {
    id: string;
    ticks: {
      id: string;
      limit: BigNumber;
      duration: BigNumber;
      rate: BigNumber;
      raw: BigNumber;
    }[];
    currencyToken: string;
    collateralToken: string;
  }[];
};

export const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/metastreet-labs/metastreet-v2-beta';

/* Block number of the creation of pool factory */
export const START_BLOCK_NUMBER = 17497132;

export type ContractPositionDefinition = {
  address: string;
  tickId: string;
  tick: BigNumber;
  limit: BigNumber;
  duration: BigNumber;
  rate: BigNumber;
  currencyTokenSymbol: string;
  collateralTokenName: string;
};

export type DataProps = {
  positionKey: string;
  tick: BigNumber; // encoded tick
};

export type Deposited = {
  amount: BigNumber;
  shares: BigNumber;
};

export type Withdrawn = {
  amount: BigNumber;
  shares: BigNumber;
};

export type Redemption = {
  amount: BigNumber;
  shares: BigNumber;
};

@PositionTemplate()
export class EthereumMetaStreetLendingV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PoolV2> {
  groupLabel = 'Lending V2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MetaStreetViemContractFactory) protected readonly contractFactory: MetaStreetViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string) {
    return this.contractFactory.poolV2({ address: _address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<ContractPositionDefinition[]> {
    const data = await gqlFetch<GetPoolsResponse>({
      endpoint: SUBGRAPH_URL,
      query: GET_POOLS_QUERY,
    });

    return data.pools.flatMap(p => {
      return p.ticks.map(t => ({
        address: p.id,
        tickId: t.id,
        tick: t.raw,
        limit: t.limit,
        duration: t.duration,
        rate: t.rate,
        currencyTokenSymbol: p.currencyToken['symbol'],
        collateralTokenName: p.collateralToken['name'],
      }));
    });
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<PoolV2, ContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const currencyTokenAddress: string = await _params.contract.read.currencyToken();
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: currencyTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: currencyTokenAddress,
        network: this.network,
      },
    ];
  }

  async getDataProps(_params: GetDataPropsParams<PoolV2, DataProps, ContractPositionDefinition>): Promise<DataProps> {
    return {
      positionKey: _params.definition.tickId,
      tick: _params.definition.tick,
    };
  }

  async getLabel(_params: GetDisplayPropsParams<PoolV2, DataProps, ContractPositionDefinition>): Promise<string> {
    const collateralTokenName: string = _params.definition.collateralTokenName; // e.g. Wrapped Cryptopunks
    const currencyTokenSymbol: string = _params.definition.currencyTokenSymbol; // e.g. WETH
    const duration: string = BigNumber.from(_params.definition.duration).lt(86400)
      ? '0'
      : BigNumber.from(_params.definition.duration).div(86400).mask(17).toString(); // round to closest days
    const limit: number = BigNumber.from(_params.definition.limit).lt(1e15)
      ? 0
      : BigNumber.from(_params.definition.limit).div(1e15).toNumber() / 1000;
    const apr: BigNumber = BigNumber.from(_params.definition.rate).mul(365 * 86400);
    const rate: number = Math.round(apr.lt(1e15) ? 0 : apr.div(1e15).toNumber() / 10);
    const labelPrefix =
      collateralTokenName && currencyTokenSymbol ? `${collateralTokenName} / ${currencyTokenSymbol} - ` : '';

    // e.g. "Wrapped Cryptopunks / DAI - 30 Day, 10%, 630000 DAI"
    return `${labelPrefix}${duration} Day, ${rate}%, ${limit} ${currencyTokenSymbol}`;
  }

  async getTokenBalancesPerPosition({
    contract,
    contractPosition,
    address,
    multicall,
  }: GetTokenBalancesParams<PoolV2, DataProps>): Promise<BigNumberish[]> {
    const tick = BigInt(contractPosition.dataProps.tick.toString());

    /* Get account's deposit logs and compute deposited amount and received shares */
    const depositLogs = await contract.getEvents.Deposited(
      { tick, account: address },
      { fromBlock: BigInt(START_BLOCK_NUMBER), toBlock: 'latest' },
    );

    const deposited: Deposited = depositLogs.reduce(
      (deposited: Deposited, l) => {
        if (l.args.tick === tick && l.args.account?.toLowerCase() === address) {
          return { amount: deposited.amount.add(l.args.amount ?? 0), shares: deposited.shares.add(l.args.shares ?? 0) };
        } else {
          return deposited;
        }
      },
      { amount: constants.Zero, shares: constants.Zero },
    );

    /* Get account's withdrawal logs and compute withdrawn amount and burned shares */
    const firstDepositBlockNumber = BigInt(depositLogs.length > 0 ? depositLogs[0].blockNumber : START_BLOCK_NUMBER);

    const withdrawLogs = await contract.getEvents.Withdrawn(
      { tick, account: address },
      { fromBlock: firstDepositBlockNumber, toBlock: 'latest' },
    );

    const withdrawn: Withdrawn = withdrawLogs.reduce(
      (withdrawn: Withdrawn, l) => {
        if (l.args.tick === tick && l.args.account?.toLowerCase() === address) {
          return { amount: withdrawn.amount.add(l.args.amount ?? 0), shares: withdrawn.shares.add(l.args.shares ?? 0) };
        } else {
          return withdrawn;
        }
      },
      { amount: constants.Zero, shares: constants.Zero },
    );

    /* Get redemption ID from account's deposit */
    const deposit = await contract.read.deposits([address, tick]);

    /* Multicall redemption available and compute total amount and shares */
    const redemptionId = Number(deposit[1]);
    const redemptionIds = Array.from({ length: redemptionId }, (_, index) => index + 1);
    const pool = multicall.wrap(contract);
    const redemptionsAvailable = await Promise.all(
      redemptionIds.map(async id => await pool.read.redemptionAvailable([address, tick, BigInt(id)])),
    );

    const redeemed: Redemption = redemptionsAvailable.reduce(
      (redemptionAvailable, [shares, amount]) => ({
        shares: redemptionAvailable.shares.add(shares),
        amount: redemptionAvailable.amount.add(amount),
      }),
      { shares: constants.Zero, amount: constants.Zero },
    );

    /* Compute active shares in tick */
    const activeShares = deposited.shares.sub(redeemed.shares).sub(withdrawn.shares);

    /* Compute current position balance from tick data in addition to redeemed amount available */
    const tickData = await contract.read.liquidityNode([tick]);
    const currentPosition = BigNumber.from(tickData.shares).eq(constants.Zero)
      ? redeemed.amount
      : activeShares.mul(tickData.value).div(tickData.shares).add(redeemed.amount);

    /* Compute deposit position based on remaining shares */
    const depositPosition = deposited.shares.gt(0)
      ? deposited.shares.sub(withdrawn.shares).mul(deposited.amount).div(deposited.shares)
      : constants.Zero;

    /* Compute supplied balance (minimum of currentPosition and depositPosition) */
    const suppliedBalance = currentPosition.gt(depositPosition) ? depositPosition : currentPosition;

    /* Compute claimable balance (interest earned) */
    const claimableBalance = currentPosition.gt(depositPosition)
      ? currentPosition.sub(depositPosition)
      : constants.Zero;

    return [suppliedBalance, claimableBalance];
  }
}
