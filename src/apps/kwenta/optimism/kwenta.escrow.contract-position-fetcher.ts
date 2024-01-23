import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { KwentaViemContractFactory } from '../contracts';
import { KwentaEscrow } from '../contracts/viem';
import { KwentaEscrowContract } from '../contracts/viem/KwentaEscrow';

@PositionTemplate()
export class OptimismKwentaEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<KwentaEscrow> {
  groupLabel = 'Escrow';
  veTokenAddress = '0x1066a8eb3d90af0ad3f89839b974658577e75be2';
  stakingContractAddress = '0x6e56a5d49f775ba08041e28030bc7826b13489e0';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaViemContractFactory) protected readonly contractFactory: KwentaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): KwentaEscrowContract {
    return this.contractFactory.kwentaEscrow({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<KwentaEscrow>) {
    return contract.read.getKwentaAddress();
  }

  async getEscrowedTokenBalance({ multicall, contract, address }: GetTokenBalancesParams<KwentaEscrow>) {
    const stakingContract = this.contractFactory.kwentaStaking({
      address: this.stakingContractAddress,
      network: this.network,
    });

    const mcStakingContract = multicall.wrap(stakingContract);
    const stakedBalance = await mcStakingContract.read.balanceOf([address]);
    const stakedNonEscrowedBalance = await mcStakingContract.read.nonEscrowedBalanceOf([address]);
    const escrowBalance = await contract.read.balanceOf([address]);

    const stakedEscrowBalance = BigNumber.from(stakedBalance).sub(stakedNonEscrowedBalance);
    return BigNumber.from(escrowBalance).sub(stakedEscrowBalance);
  }
}
