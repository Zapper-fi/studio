import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { InverseFirmContractFactory, SimpleMarket } from '../contracts';

export type InverseFirmLoanContractPositionDefinition = {
  address: string;
  suppliedTokenAddress: string;
  borrowedTokenAddress: string;
};

@PositionTemplate()
export class EthereumInverseFirmLoanContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SimpleMarket,
  DefaultDataProps,
  InverseFirmLoanContractPositionDefinition
> {
  groupLabel = 'Lending';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseFirmContractFactory) private readonly contractFactory: InverseFirmContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SimpleMarket {
    return this.contractFactory.simpleMarket({ network: this.network, address });
  }

  async getDefinitions(): Promise<InverseFirmLoanContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const dolaBorrowRightContract = this.contractFactory.dbr({
      address: '0xad038eb671c44b853887a7e32528fab35dc5d710',
      network: this.network,
    });

    const logs = await dolaBorrowRightContract.queryFilter(dolaBorrowRightContract.filters.AddMarket(), 16155757);
    const markets = uniq(logs.map(l => l.args.market.toLowerCase()));

    const definitions = await Promise.all(
      markets.map(async address => {
        const simpleMarketContract = this.contractFactory.simpleMarket({ address, network: this.network });
        const collateralTokenAddressRaw = await multicall.wrap(simpleMarketContract).collateral();

        return {
          address,
          suppliedTokenAddress: collateralTokenAddressRaw.toLowerCase(),
          borrowedTokenAddress: '0x865377367054516e17014ccded1e7d814edc9ce4', // dola
        };
      }),
    );

    return definitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SimpleMarket, InverseFirmLoanContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.suppliedTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: definition.borrowedTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SimpleMarket>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Market`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<SimpleMarket>): Promise<BigNumberish[]> {
    const personalEscrow = await contract.escrows(address);

    const simpleEscrowContract = this.contractFactory.simpleEscrow({
      address: personalEscrow.toLowerCase(),
      network: this.network,
    });
    const supplied = await multicall.wrap(simpleEscrowContract).balance();

    const borrowed = await contract.debts(address);

    return [supplied, borrowed];
  }
}
