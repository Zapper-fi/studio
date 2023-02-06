import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { BEANSTALK_ADDRESS, Token, GRAPH_URL, silos } from '../common/beanstalk.helper';
import { Beanstalk, BeanstalkContractFactory } from '../contracts';
import { GET_DEPOSIT } from '../graphql/getSiloDeposit';

export type SiloDefinition = {
  address: string;
  underlying: Token[];
  siloName: string;
};

@PositionTemplate()
export class EthereumBeanstalkSiloContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Beanstalk> {
  groupLabel = 'Silo Deposits';
  contract: Beanstalk;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeanstalkContractFactory) protected readonly beanstalkContractFactory: BeanstalkContractFactory,
  ) {
    super(appToolkit);
  }

  // We memoize it since it's the same Beanstalk contract for all positions
  getContract(_address: string): Beanstalk {
    if (!this.contract) {
      this.contract = this.beanstalkContractFactory.beanstalk({ address: BEANSTALK_ADDRESS, network: this.network });
    }
    return this.contract;
  }

  getDefinitions(_params: GetDefinitionsParams): Promise<SiloDefinition[]> {
    return Promise.resolve(
      Object.keys(silos).map(address => ({
        address: address,
        underlying: silos[address].underlying,
        siloName: silos[address].name,
      })),
    );
  }

  getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<Beanstalk, SiloDefinition>): Promise<UnderlyingTokenDefinition[] | null> {
    return Promise.resolve(
      definition.underlying.map(bt => ({
        metaType: MetaType.SUPPLIED,
        address: bt.address,
        network: this.network,
      })),
    );
  }

  getLabel({
    contractPosition,
  }: GetDisplayPropsParams<Beanstalk, DefaultDataProps, DefaultContractPositionDefinition>): Promise<string> {
    const silo = silos[contractPosition.address];
    return Promise.resolve(silo.name);
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<Beanstalk, DefaultDataProps>): Promise<BigNumberish[]> {
    const data = await gqlFetch({
      endpoint: GRAPH_URL,
      query: GET_DEPOSIT,
      variables: {
        token: contractPosition.address,
        account: address,
      },
    });

    const total = [...(data?.farmer?.deposited ?? []), ...(data?.farmer?.withdrawn ?? [])].reduce((prev, curr) => {
      return (prev as BigNumber).add(curr.amount);
    }, ethers.constants.Zero);

    return [total];
  }
}
