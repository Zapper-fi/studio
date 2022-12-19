import { Inject } from '@nestjs/common';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { MahadaoContractFactory, MahadoMahaxLocker } from '../contracts';

@PositionTemplate()
export class EthereumMahadaoLockerContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<MahadoMahaxLocker> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xbdd8f4daf71c2cb16cce7e54bb81ef3cfcf5aacb';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MahadaoContractFactory) protected readonly contractFactory: MahadaoContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): MahadoMahaxLocker {
    return this.contractFactory.mahadoMahaxLocker({ address, network: this.network });
  }

  async getEscrowedTokenAddress() {
    return '0xb4d930279552397bba2ee473229f89ec245bc365';
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<MahadoMahaxLocker>) {
    const positionCount = Number(await contract.balanceOf(address));

    const balances = await Promise.all(
      range(positionCount).map(async i => {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const lockedAmount = await contract.locked(tokenId);

        return Number(lockedAmount.amount);
      }),
    );

    return sum(balances);
  }
}
