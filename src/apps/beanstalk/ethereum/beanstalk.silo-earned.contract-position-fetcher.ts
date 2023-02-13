import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Beanstalk, BeanstalkContractFactory } from '../contracts';

export type BeanstalkSiloEarnedContractPositionDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumBeanstalkSiloEarnedContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  Beanstalk,
  DefaultDataProps,
  BeanstalkSiloEarnedContractPositionDefinition
> {
  groupLabel = 'Silo Earnings';

  isExcludedFromExplore = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeanstalkContractFactory) protected readonly beanstalkContractFactory: BeanstalkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Beanstalk {
    return this.beanstalkContractFactory.beanstalk({ address, network: this.network });
  }

  async getDefinitions(): Promise<BeanstalkSiloEarnedContractPositionDefinition[]> {
    return [
      {
        address: '0xc1e088fc1323b20bcbee9bd1b9fc9546db5624c5', // Beanstalk
        underlyingTokenAddress: '0xbea0000029ad1c77d3d5d23ba2d8893db9d1efab', // Bean
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<Beanstalk, BeanstalkSiloEarnedContractPositionDefinition>): Promise<
    UnderlyingTokenDefinition[]
  > {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel(): Promise<string> {
    return 'Earned Beans';
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Beanstalk>): Promise<BigNumberish[]> {
    const earnedBeans = await contract.balanceOfEarnedBeans(address);
    return [earnedBeans];
  }
}
