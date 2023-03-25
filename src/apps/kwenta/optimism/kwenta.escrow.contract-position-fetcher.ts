import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { KwentaContractFactory, KwentaEscrow } from '../contracts';

@PositionTemplate()
export class OptimismKwentaEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<KwentaEscrow> {
  groupLabel = 'Escrow';
  veTokenAddress = '0x1066a8eb3d90af0ad3f89839b974658577e75be2';
  stakingContractAddress = '0x6e56a5d49f775ba08041e28030bc7826b13489e0';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaContractFactory) protected readonly contractFactory: KwentaContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): KwentaEscrow {
    return this.contractFactory.kwentaEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<KwentaEscrow>) {
    return contract.getKwentaAddress();
  }

  async getEscrowedTokenBalance({ multicall, contract, address }: GetTokenBalancesParams<KwentaEscrow>) {
    const stakingContract = this.contractFactory.kwentaStaking({ address: this.stakingContractAddress, network: this.network });
    const mcStakingContract = multicall.wrap(stakingContract);
    const stakedBalance = await mcStakingContract.balanceOf(address);
    const stakedNonEscrowedBalance = await mcStakingContract.nonEscrowedBalanceOf(address);
    const escrowBalance = await contract.balanceOf(address);
    const stakedEscrowBalance = stakedBalance.sub(stakedNonEscrowedBalance);
    return escrowBalance.sub(stakedEscrowBalance);
  }
}
