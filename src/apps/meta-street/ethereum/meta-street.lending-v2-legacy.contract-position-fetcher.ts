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

import { MetaStreetContractFactory, PoolV2Legacy } from '../contracts';

export const GET_POOLS_QUERY = gql`
  {
    pools(where: { implementationVersionMajor: "1" }) {
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
export class EthereumMetaStreetLendingV2LegacyContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PoolV2Legacy> {
  groupLabel = 'Lending V2 Legacy';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MetaStreetContractFactory) protected readonly contractFactory: MetaStreetContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): PoolV2Legacy {
    return this.contractFactory.poolV2Legacy({ address: _address, network: this.network });
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
    _params: GetTokenDefinitionsParams<PoolV2Legacy, ContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const currencyTokenAddress: string = await _params.contract.currencyToken();
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

  async getDataProps(
    _params: GetDataPropsParams<PoolV2Legacy, DataProps, ContractPositionDefinition>,
  ): Promise<DataProps> {
    return {
      positionKey: _params.definition.tickId,
      tick: _params.definition.tick,
    };
  }

  async getLabel(_params: GetDisplayPropsParams<PoolV2Legacy, DataProps, ContractPositionDefinition>): Promise<string> {
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
  }: GetTokenBalancesParams<PoolV2Legacy, DataProps>): Promise<BigNumberish[]> {
    const tick: BigNumber = contractPosition.dataProps.tick;

    /* Get account's deposit logs and compute deposited amount and received shares */
    const depositLogs = await contract.queryFilter(contract.filters.Deposited(address, tick), START_BLOCK_NUMBER);
    const deposited: Deposited = depositLogs.reduce(
      (deposited: Deposited, l) => {
        if (l.args.tick.eq(tick) && l.args.account.toLowerCase() === address) {
          return { amount: deposited.amount.add(l.args.amount), shares: deposited.shares.add(l.args.shares) };
        } else {
          return deposited;
        }
      },
      { amount: constants.Zero, shares: constants.Zero },
    );

    /* Get account's withdrawal logs and compute withdrawn amount and burned shares */
    const firstDepositBlockNumber: number = depositLogs.length > 0 ? depositLogs[0].blockNumber : START_BLOCK_NUMBER;
    const withdrawLogs = await contract.queryFilter(contract.filters.Withdrawn(address, tick), firstDepositBlockNumber);
    const withdrawn: Withdrawn = withdrawLogs.reduce(
      (withdrawn: Withdrawn, l) => {
        if (l.args.tick.eq(tick) && l.args.account.toLowerCase() === address) {
          return { amount: withdrawn.amount.add(l.args.amount), shares: withdrawn.shares.add(l.args.shares) };
        } else {
          return withdrawn;
        }
      },
      { amount: constants.Zero, shares: constants.Zero },
    );

    /* Get redemption available */
    const redemptionAvailable = await contract.redemptionAvailable(address, tick);

    /* Compute active shares in tick */
    const activeShares = deposited.shares.sub(redemptionAvailable.shares).sub(withdrawn.shares);

    /* Compute current position balance from tick data in addition to redeemed amount available */
    const tickData = await contract.liquidityNode(tick);
    const currentPosition = tickData.shares.eq(constants.Zero)
      ? redemptionAvailable.amount
      : activeShares.mul(tickData.value).div(tickData.shares).add(redemptionAvailable.amount);

    /* Compute deposit position (deposit shares * depositor's avg share price - withdrawn amount) */
    const depositPosition = deposited.shares.eq(constants.Zero)
      ? constants.Zero
      : deposited.shares.mul(deposited.amount).div(deposited.shares).sub(withdrawn.amount);

    /* Compute supplied and claimable balances */
    const suppliedBalance = depositPosition.gt(currentPosition) ? currentPosition : depositPosition;
    const claimableBalance = depositPosition.gt(currentPosition)
      ? constants.Zero
      : currentPosition.sub(depositPosition);

    return [suppliedBalance, claimableBalance];
  }
}
