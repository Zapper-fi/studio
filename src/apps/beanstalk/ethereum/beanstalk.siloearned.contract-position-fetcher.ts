import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
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

import { BEAN, BEANSTALK_ADDRESS } from '../common/beanstalk.helper';
import { Beanstalk, BeanstalkContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumBeanstalkSiloEarnedContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Beanstalk> {
  groupLabel = 'Silo Earnings';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeanstalkContractFactory) protected readonly beanstalkContractFactory: BeanstalkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): Beanstalk {
    return this.beanstalkContractFactory.beanstalk({ address: BEANSTALK_ADDRESS, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xearnedbeans' }];
  }

  async getTokenDefinitions({
    address,
  }: GetTokenDefinitionsParams<Contract, DefaultContractPositionDefinition>): Promise<
    UnderlyingTokenDefinition[] | null
  > {
    if (address !== '0xearnedbeans') {
      throw new Error(`Unknown token: ${address}`);
    }

    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: BEAN.address,
        network: this.network,
      },
    ];
  }

  async getLabel(
    _params: GetDisplayPropsParams<Contract, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return 'Earned Beans';
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<Contract, DefaultDataProps>): Promise<BigNumberish[]> {
    if (contractPosition.address !== '0xearnedbeans') {
      throw new Error(`Unknown contract position: ${address}`);
    }

    const earnedBeans = await this.getContract('').balanceOfEarnedBeans(address);
    return [earnedBeans];
  }
}
