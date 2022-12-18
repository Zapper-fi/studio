import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { BluebitContractFactory, BluebitVeToken } from '../contracts';

@PositionTemplate()
export class AuroraBluebitVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<BluebitVeToken> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xdf7c547f332351a86db0d89a89799a7ab4ec9deb';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BluebitContractFactory) protected readonly contractFactory: BluebitContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): BluebitVeToken {
    return this.contractFactory.bluebitVeToken({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<BluebitVeToken>) {
    return contract.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<BluebitVeToken>) {
    return contract.lockedOf(address).then(v => v.amount);
  }
}
