import { Inject } from '@nestjs/common';
import { range, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { BondTellerErc20, SolaceContractFactory } from '../contracts';

export type SolaceBondDefinition = {
  address: string;
  suppliedTokenAddress: string;
  claimableTokenAddress: string;
};

export abstract class SolaceBondsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  BondTellerErc20,
  DefaultDataProps,
  SolaceBondDefinition
> {
  abstract bondTellerAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) protected readonly contractFactory: SolaceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BondTellerErc20 {
    return this.contractFactory.bondTellerErc20({ address, network: this.network });
  }

  async getDefinitions(): Promise<SolaceBondDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    return Promise.all(
      this.bondTellerAddresses.map(async address => {
        const bondTellerContract = this.contractFactory.bondTellerErc20({ address, network: this.network });
        const [suppliedTokenAddressRaw, claimableTokenAddressRaw] = await Promise.all([
          multicall.wrap(bondTellerContract).principal(),
          multicall.wrap(bondTellerContract).solace(),
        ]);
        return {
          address,
          suppliedTokenAddress: suppliedTokenAddressRaw.toLowerCase(),
          claimableTokenAddress: claimableTokenAddressRaw.toLowerCase(),
        };
      }),
    );
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<BondTellerErc20, SolaceBondDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.suppliedTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.claimableTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contract }: GetDisplayPropsParams<BondTellerErc20>) {
    return contract.name();
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<BondTellerErc20>) {
    const numPositionsRaw = await contract.balanceOf(address);

    const balances = await Promise.all(
      range(0, numPositionsRaw.toNumber()).map(async index => {
        const bondId = await contract.tokenOfOwnerByIndex(address, index);

        const bond = await contract.bonds(bondId);

        return {
          supplied: bond.principalPaid,
          claimable: bond.payoutAlreadyClaimed,
        };
      }),
    );

    const supplied = sum(balances.map(x => x.supplied));
    const claimables = sum(balances.map(x => x.claimable));

    return [supplied, claimables];
  }
}
