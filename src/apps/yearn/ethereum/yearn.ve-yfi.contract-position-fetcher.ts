import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { YearnViemContractFactory } from '../contracts';
import { YearnVeYfi } from '../contracts/viem';
import { YearnVeYfiContract } from '../contracts/viem/YearnVeYfi';

@PositionTemplate()
export class EthereumYearnVeYfiContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<YearnVeYfi> {
  groupLabel = 'veYFI';
  veTokenAddress = '0x90c1f9220d90d3966fbee24045edd73e1d588ad5';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnViemContractFactory) protected readonly contractFactory: YearnViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): YearnVeYfiContract {
    return this.contractFactory.yearnVeYfi({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<YearnVeYfi>) {
    return contract.read.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<YearnVeYfi>) {
    return contract.read.locked([address]).then(v => v.amount);
  }
}
