import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  OlympusBondContractPositionFetcher,
  ResolveClaimableBalanceParams,
  ResolveVestingBalanceParams,
} from '~apps/olympus/common/olympus.bond.contract-position-fetcher';

import { JpegdBondDepository, JpegdContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumJpegdBondContractPositionFetcher extends OlympusBondContractPositionFetcher<JpegdBondDepository> {
  groupLabel = 'Bonds';
  bondDefinitions = [
    {
      address: '0x84f0015998021fe53fdc7f1c299bd7c92fccd455',
      bondedTokenAddress: '0xe0abce449a0e368eaf657f6f1c0ed5711174c46f',
      mintedTokenAddress: '0xe80c0cd204d654cebe8dd64a4857cab6be8345a3',
    },
  ];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JpegdContractFactory) protected readonly contractFactory: JpegdContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): JpegdBondDepository {
    return this.contractFactory.jpegdBondDepository({ address, network: this.network });
  }

  async resolveVestingBalance({
    address,
    contract,
  }: ResolveVestingBalanceParams<JpegdBondDepository>): Promise<BigNumberish> {
    const [bondInfo, pendingPayout] = await Promise.all([
      contract.bondInfo(address),
      contract.pendingPayoutFor(address),
    ]);

    const vestingBalanceRaw = bondInfo.payout.gt(pendingPayout) ? bondInfo.payout.sub(pendingPayout) : 0;
    return vestingBalanceRaw;
  }

  resolveClaimableBalance({
    address,
    contract,
  }: ResolveClaimableBalanceParams<JpegdBondDepository>): Promise<BigNumberish> {
    return contract.pendingPayoutFor(address);
  }
}
