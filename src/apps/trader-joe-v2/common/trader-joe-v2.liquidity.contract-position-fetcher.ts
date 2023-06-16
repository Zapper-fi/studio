import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { TraderJoeV2ContractFactory, TraderJoeV2LbFactory } from '../contracts';

type TraderJoeV2ContractPositionDefinition = DefaultContractPositionDefinition & {
  poolAddress: string;
  token0Address: string;
  token1Address: string;
  reserveToken0: BigNumber;
  reserveToken1: BigNumber;
  binStep: number;
};

export abstract class AbstractTraderJoeV2LiquidityContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel = 'liquidity';

  abstract subgraphUrl: string;
  abstract factoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeV2ContractFactory) protected readonly traderJoeV2ContractFactory: TraderJoeV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TraderJoeV2LbFactory {
    return this.traderJoeV2ContractFactory.traderJoeV2LbFactory({
      address,
      network: this.network,
    });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<TraderJoeV2ContractPositionDefinition[]> {
    // Safe cast toNumber()
    //  - getNumberOfLBPairs() returns the total number of pairs, which concretely cannot exceed the JS number
    const pairCount = (await this.getContract(this.factoryAddress).getNumberOfLBPairs()).toNumber();

    return Promise.all(
      range(0, pairCount).map(i =>
        (async () => {
          const pairAddress = await multicall.wrap(this.getContract(this.factoryAddress)).getLBPairAtIndex(i);
          const pairContract = this.traderJoeV2ContractFactory.traderJoeV2LbPairProxy({
            address: pairAddress,
            network: this.network,
          });

          const [token0Address, token1Address, binStep, [reserveToken0, reserveToken1]] = await Promise.all([
            multicall.wrap(pairContract).getTokenX(),
            multicall.wrap(pairContract).getTokenY(),
            multicall.wrap(pairContract).getBinStep(),
            multicall.wrap(pairContract).getReserves(),
          ]);

          return {
            address: this.factoryAddress,
            poolAddress: pairAddress,
            token0Address,
            token1Address,
            reserveToken0,
            reserveToken1,
            binStep,
          };
        })(),
      ),
    ).then(arr => arr.filter(x => !x.reserveToken0.eq(0) && !x.reserveToken1.eq(0)));
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<Contract, DefaultDataProps, TraderJoeV2ContractPositionDefinition>): Promise<DefaultDataProps> {
    return {
      tokenSupply: [
        {
          address: definition.token0Address,
          reserve: definition.reserveToken0.toString(),
        },
        {
          address: definition.token1Address,
          reserve: definition.reserveToken1.toString(),
        },
      ],
      binStep: definition.binStep,
    };
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<Contract, TraderJoeV2ContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token0Address,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token1Address,
        network: this.network,
      },
    ];
  }

  async getLabel(
    params: GetDisplayPropsParams<Contract, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    const symbol = await params.contractPosition.tokens.map(t => getLabelFromToken(t)).join(' / ');
    return symbol;
  }

  getTokenBalancesPerPosition(_params: GetTokenBalancesParams<Contract, DefaultDataProps>): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    return [];
  }
}
