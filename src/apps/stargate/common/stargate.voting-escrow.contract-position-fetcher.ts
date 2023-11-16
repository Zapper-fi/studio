import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { StargateViemContractFactory } from '../contracts';
import { StargateVe } from '../contracts/viem';
import { StargateVeContract } from '../contracts/viem/StargateVe';

export abstract class StargateVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<StargateVe> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateViemContractFactory) protected readonly contractFactory: StargateViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): StargateVeContract {
    return this.contractFactory.stargateVe({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<StargateVe>) {
    return contract.read.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<StargateVe>) {
    return (await contract.read.locked([address]))[0];
  }
}
