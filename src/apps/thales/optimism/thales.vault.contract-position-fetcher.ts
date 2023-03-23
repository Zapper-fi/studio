import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { Vaults, ThalesContractFactory } from '../contracts';

export type ThalesVaultDefinition = {
  address: string;
  name: string;
};

@PositionTemplate()
export class OptimismThalesVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Vaults> {
  groupLabel = 'Vault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Vaults {
    return this.contractFactory.vaults({ network: this.network, address });
  }

  async getDefinitions(): Promise<ThalesVaultDefinition[]> {
    return [
      { address: '0xb484027cb0c538538bad2be492714154f9196f93', name: 'Thales Discount' },
      { address: '0x43318de9e8f65b591598f17add87ae7247649c83', name: 'Thales Degen Discount' },
      { address: '0x6c7fd4321183b542e81bcc7de4dfb88f9dbca29f', name: 'Thales Safu Discount' },
      { address: '0xc922f4cde42dd658a7d3ea852caf7eae47f6cecd', name: 'Overtime Discount' },
      { address: '0xbaac5464bf6e767c9af0e8d4677c01be2065fd5f', name: 'Overtime Degen Discount' },
      { address: '0x43d19841d818b2ccc63a8b44ce8c7def8616d98e', name: 'Overtime Safu Discount' },
      { address: '0x8285047f33c26c1bf5b387f2b07f21a2af29ace2', name: 'Overtime Parlay Discount' },
    ];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Vaults>) {
    return [
      {
        address: await contract.sUSD(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<Vaults, DefaultDataProps, ThalesVaultDefinition>) {
    return `${definition.name}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Vaults>): Promise<BigNumberish[]> {
    const currentRound = await contract.round();
    const currentBalance = await contract.getBalancesPerRound(Number(currentRound), address);
    const pendingDeposit = await contract.getBalancesPerRound(Number(currentRound) + 1, address);

    return [currentBalance.add(pendingDeposit)];
  }
}
