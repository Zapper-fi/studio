import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { YearnContractFactory, YearnVeYfi } from '../contracts';

@PositionTemplate()
export class EthereumYearnVeYfiContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<YearnVeYfi> {
  groupLabel = 'veYFI';
  veTokenAddress = '0x90c1f9220d90d3966fbee24045edd73e1d588ad5';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): YearnVeYfi {
    return this.contractFactory.yearnVeYfi({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<YearnVeYfi>) {
    return contract.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<YearnVeYfi>) {
    return contract.locked(address).then(v => v.amount);
  }
}
