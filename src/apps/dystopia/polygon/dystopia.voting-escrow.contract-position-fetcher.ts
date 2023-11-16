import { Inject } from '@nestjs/common';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { DystopiaViemContractFactory } from '../contracts';
import { DystopiaVe } from '../contracts/viem';
import { DystopiaVeContract } from '../contracts/viem/DystopiaVe';

@PositionTemplate()
export class PolygonDystopiaVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<DystopiaVe> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x060fa7ad32c510f12550c7a967999810dafc5697';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DystopiaViemContractFactory) protected readonly contractFactory: DystopiaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): DystopiaVeContract {
    return this.contractFactory.dystopiaVe({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<DystopiaVe>) {
    return contract.read.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<DystopiaVe>) {
    const veCount = Number(await contract.read.balanceOf([address]));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await contract.read.tokenOfOwnerByIndex([address, BigInt(i)]);
        const balance = await contract.read.balanceOfNFT([tokenId]);
        return Number(balance);
      }),
    );

    return sum(balances);
  }
}
