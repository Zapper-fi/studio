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
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { BeanstalkBalanceResolver } from '../common/beanstalk.balance-resolver';
import { BeanstalkViemContractFactory } from '../contracts';
import { Beanstalk } from '../contracts/viem';

export type BeanstalkSiloDepositDefinition = {
  address: string;
  underlyingTokenAddresses: string;
  name: string;
};

export const SILOS = [
  {
    name: 'Bean',
    underlyingTokenAddress: '0xbea0000029ad1c77d3d5d23ba2d8893db9d1efab',
  },
  {
    name: 'BEAN:3CRV LP',
    underlyingTokenAddress: '0xc9c32cd16bf7efb85ff14e0c8603cc90f6f2ee49',
  },
  {
    name: 'Unripe Bean',
    underlyingTokenAddress: '0x1bea0050e63e05fbb5d8ba2f10cf5800b6224449',
  },
  {
    name: 'Unripe BEAN:3CRV LP',
    underlyingTokenAddress: '0x1bea3ccd22f4ebd3d37d731ba31eeca95713716d',
  },
];

@PositionTemplate()
export class EthereumBeanstalkSiloDepositContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  Beanstalk,
  DefaultDataProps,
  BeanstalkSiloDepositDefinition
> {
  groupLabel = 'Silo Deposits';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeanstalkViemContractFactory) protected readonly contractFactory: BeanstalkViemContractFactory,
    @Inject(BeanstalkBalanceResolver) protected readonly beanstalkBalanceResolver: BeanstalkBalanceResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.beanstalk({ address, network: this.network });
  }

  async getDefinitions(): Promise<BeanstalkSiloDepositDefinition[]> {
    const address = '0xc1e088fc1323b20bcbee9bd1b9fc9546db5624c5';
    const definition = SILOS.map(silo => {
      return {
        address,
        underlyingTokenAddresses: silo.underlyingTokenAddress,
        name: silo.name,
      };
    });

    return definition;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<Beanstalk, BeanstalkSiloDepositDefinition>): Promise<UnderlyingTokenDefinition[]> {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddresses,
        network: this.network,
      },
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<Beanstalk, DefaultDataProps, BeanstalkSiloDepositDefinition>): Promise<string> {
    return definition.name;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<Beanstalk, DefaultDataProps>): Promise<BigNumberish[]> {
    const tokenAddress = contractPosition.tokens[0].address;
    const balanceRaw = await this.beanstalkBalanceResolver.getSiloBalances(address, tokenAddress);

    return [balanceRaw];
  }
}
