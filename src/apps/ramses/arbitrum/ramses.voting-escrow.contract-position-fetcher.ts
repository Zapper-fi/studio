import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { RamsesContractFactory, RamsesVe, RamsesRewards } from '../contracts';

@PositionTemplate()
export class ArbitrumRamsesVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  RamsesVe,
  RamsesRewards
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xaaa343032aa79ee9a6897dab03bef967c3289a06';
  rewardAddress = '0xaaa86b908a3b500a0de661301ea63966923a97b1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RamsesContractFactory) protected readonly contractFactory: RamsesContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): RamsesVe {
    return this.contractFactory.ramsesVe({ address, network: this.network });
  }

  getRewardContract(address: string): RamsesRewards {
    return this.contractFactory.ramsesRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: RamsesVe): Promise<string> {
    return contract.token();
  }

  async getRewardTokenBalance(address: string, contract: RamsesRewards): Promise<BigNumberish> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const veCount = Number(await escrow.balanceOf(address));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.tokenOfOwnerByIndex(address, i);
        const balance = await contract.claimable(tokenId);
        return Number(balance);
      }),
    );

    return sum(balances);
  }

  getRewardTokenAddress(contract: RamsesRewards): Promise<string> {
    return contract.token();
  }

  async getEscrowedTokenBalance(address: string, contract: RamsesVe): Promise<BigNumberish> {
    const veCount = Number(await contract.balanceOf(address));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const balance = await contract.locked(tokenId);
        return Number(balance.amount);
      }),
    );

    return sum(balances);
  }
}
