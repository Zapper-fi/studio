import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { OlympusContractFactory, OlympusV2BondDepository } from '../contracts';

export type OlympusBondContractPositionDefinition = {
  address: string;
  mintedTokenAddress: string;
  bondedTokenAddress: string;
};

@PositionTemplate()
export class EthereumOlympusBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  OlympusV2BondDepository,
  DefaultDataProps,
  OlympusBondContractPositionDefinition
> {
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) protected readonly contractFactory: OlympusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): OlympusV2BondDepository {
    return this.contractFactory.olympusV2BondDepository({ address, network: this.network });
  }

  async getDefinitions(): Promise<OlympusBondContractPositionDefinition[]> {
    return [
      {
        address: '0x9025046c6fb25fb39e720d97a8fd881ed69a1ef6',
        mintedTokenAddress: '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f',
        bondedTokenAddress: '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f',
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<OlympusV2BondDepository, OlympusBondContractPositionDefinition>) {
    return [
      { metaType: MetaType.VESTING, address: definition.mintedTokenAddress },
      { metaType: MetaType.CLAIMABLE, address: definition.mintedTokenAddress },
      { metaType: MetaType.SUPPLIED, address: definition.bondedTokenAddress },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<OlympusV2BondDepository>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Bond`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<OlympusV2BondDepository, DefaultDataProps>): Promise<BigNumberish[]> {
    const indexes = await multicall.wrap(contract).indexesFor(address);
    const pendingBonds = await Promise.all(indexes.map(index => multicall.wrap(contract).pendingFor(address, index)));

    const claimableBonds = pendingBonds.filter(p => p.matured_);
    const vestingBonds = pendingBonds.filter(p => !p.matured_);

    const claimableAmount = claimableBonds.reduce((acc, bond) => acc.add(bond.payout_), BigNumber.from('0'));
    const vestingAmount = vestingBonds.reduce((acc, bond) => {
      return acc.add(bond.payout_);
    }, BigNumber.from('0'));

    return [vestingAmount, claimableAmount, 0];
  }
}
