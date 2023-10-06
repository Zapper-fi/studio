import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { KwentaContractFactory, KwentaStakingV2 } from '../contracts';

@PositionTemplate()
export class OptimismKwentaEscrowV2ContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<KwentaStakingV2> {
  groupLabel = 'Escrow V2';
  veTokenAddress = '0x61294940ce7cd1bda10e349adc5b538b722ceb88';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaContractFactory) protected readonly contractFactory: KwentaContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): KwentaStakingV2 {
    return this.contractFactory.kwentaStakingV2({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<KwentaStakingV2>) {
    return contract.kwenta();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<KwentaStakingV2>) {
    return await contract.unstakedEscrowedBalanceOf(address);
  }
}
