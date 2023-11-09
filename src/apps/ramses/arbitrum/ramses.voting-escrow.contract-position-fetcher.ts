import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { RamsesViemContractFactory } from '../contracts';
import { RamsesVe, RamsesRewards } from '../contracts/viem';

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
    @Inject(RamsesViemContractFactory) protected readonly contractFactory: RamsesViemContractFactory,
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
    return contract.read.token();
  }

  async getRewardTokenBalance(address: string, contract: RamsesRewards): Promise<BigNumberish> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const veCount = Number(await escrow.balanceOf(address));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.tokenOfOwnerByIndex(address, i);
        const balance = await contract.read.claimable([tokenId]);
        return Number(balance);
      }),
    );

    return sum(balances);
  }

  getRewardTokenAddress(contract: RamsesRewards): Promise<string> {
    return contract.read.token();
  }

  async getEscrowedTokenBalance(address: string, contract: RamsesVe): Promise<BigNumberish> {
    const veCount = Number(await contract.read.balanceOf([address]));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await contract.read.tokenOfOwnerByIndex([address, i]);
        const balance = await contract.read.locked([tokenId]);
        return Number(balance.amount);
      }),
    );

    return sum(balances);
  }
}
