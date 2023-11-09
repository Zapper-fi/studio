import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { OpnxViemContractFactory } from '../contracts';
import { Veox } from '../contracts/viem';

@PositionTemplate()
export class EthereumOpnxContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<Veox> {
  veTokenAddress = '0x28901cf869d94c9d892fbd86c8e57b801e8fdd87';
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OpnxViemContractFactory) private readonly opnxContractFactory: OpnxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): Veox {
    return this.opnxContractFactory.veox({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<Veox>) {
    return contract.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<Veox>) {
    return contract.locked(address).then(v => v.amount);
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Veox>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }
}
