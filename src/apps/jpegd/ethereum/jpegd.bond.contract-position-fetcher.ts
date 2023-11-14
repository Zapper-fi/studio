import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { OlympusBondContractPositionFetcher } from '~apps/olympus/common/olympus.bond.contract-position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { JpegdViemContractFactory } from '../contracts';
import { JpegdBondDepository } from '../contracts/viem';

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
    @Inject(JpegdViemContractFactory) protected readonly contractFactory: JpegdViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jpegdBondDepository({ address, network: this.network });
  }

  async resolveBondDefinitions() {
    return this.bondDefinitions;
  }

  async resolveVestingBalance({ address, contract }: GetTokenBalancesParams<JpegdBondDepository>) {
    const [[payout], pendingPayout] = await Promise.all([
      contract.read.bondInfo([address]),
      contract.read.pendingPayoutFor([address]),
    ]);

    const vestingBalanceRaw = payout > pendingPayout ? payout - pendingPayout : 0;
    return vestingBalanceRaw;
  }

  resolveClaimableBalance({ address, contract }: GetTokenBalancesParams<JpegdBondDepository>) {
    return contract.read.pendingPayoutFor([address]);
  }
}
