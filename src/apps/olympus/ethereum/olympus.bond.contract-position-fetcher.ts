import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import {
  OlympusBondContractPositionFetcher,
  ResolveClaimableBalanceParams,
  ResolveVestingBalanceParams,
} from '../common/olympus.bond.contract-position-fetcher';
import { OlympusContractFactory, OlympusV2BondDepository } from '../contracts';

@PositionTemplate()
export class EthereumOlympusBondContractPositionFetcher extends OlympusBondContractPositionFetcher<OlympusV2BondDepository> {
  groupLabel = 'Bonds';
  bondDefinitions = [
    {
      address: '0x9025046c6fb25fb39e720d97a8fd881ed69a1ef6',
      mintedTokenAddress: '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f',
      bondedTokenAddress: '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f',
    },
  ];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) protected readonly contractFactory: OlympusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): OlympusV2BondDepository {
    return this.contractFactory.olympusV2BondDepository({ address, network: this.network });
  }

  async resolveVestingBalance({ address, contract, multicall }: ResolveVestingBalanceParams<OlympusV2BondDepository>) {
    const indexes = await multicall.wrap(contract).indexesFor(address);
    const pendingBonds = await Promise.all(indexes.map(index => multicall.wrap(contract).pendingFor(address, index)));
    const vestingBonds = pendingBonds.filter(p => !p.matured_);
    const vestingAmount = vestingBonds.reduce((acc, bond) => acc.add(bond.payout_), BigNumber.from('0'));
    return vestingAmount;
  }

  async resolveClaimableBalance({
    address,
    contract,
    multicall,
  }: ResolveClaimableBalanceParams<OlympusV2BondDepository>) {
    const indexes = await multicall.wrap(contract).indexesFor(address);
    const pendingBonds = await Promise.all(indexes.map(index => multicall.wrap(contract).pendingFor(address, index)));
    const claimableBonds = pendingBonds.filter(p => p.matured_);
    const claimableAmount = claimableBonds.reduce((acc, bond) => acc.add(bond.payout_), BigNumber.from('0'));
    return claimableAmount;
  }
}
