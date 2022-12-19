import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { EscrowThales, ThalesContractFactory } from '../contracts';

@PositionTemplate()
export class OptimismThalesEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<EscrowThales> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xa25816b9605009aa446d4d597f0aa46fd828f056';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) protected readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): EscrowThales {
    return this.contractFactory.escrowThales({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<EscrowThales>) {
    return contract.vestingToken();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<EscrowThales>) {
    return contract.totalAccountEscrowedAmount(address);
  }
}
