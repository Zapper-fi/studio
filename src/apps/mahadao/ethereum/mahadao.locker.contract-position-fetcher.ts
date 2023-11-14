import { Inject } from '@nestjs/common';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { MahadaoViemContractFactory } from '../contracts';
import { MahadoMahaxLocker } from '../contracts/viem';
import { MahadoMahaxLockerContract } from '../contracts/viem/MahadoMahaxLocker';

@PositionTemplate()
export class EthereumMahadaoLockerContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<MahadoMahaxLocker> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xbdd8f4daf71c2cb16cce7e54bb81ef3cfcf5aacb';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MahadaoViemContractFactory) protected readonly contractFactory: MahadaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): MahadoMahaxLockerContract {
    return this.contractFactory.mahadoMahaxLocker({ address, network: this.network });
  }

  async getEscrowedTokenAddress() {
    return '0x745407c86df8db893011912d3ab28e68b62e49b0';
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<MahadoMahaxLocker>) {
    const positionCount = Number(await contract.read.balanceOf([address]));

    const balances = await Promise.all(
      range(positionCount).map(async i => {
        const tokenId = await contract.read.tokenOfOwnerByIndex([address, BigInt(i)]);
        const lockedAmount = await contract.read.locked([tokenId]);
        return Number(lockedAmount[0]);
      }),
    );

    return sum(balances);
  }
}
