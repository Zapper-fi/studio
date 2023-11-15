import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { RamsesViemContractFactory } from '../contracts';
import { RamsesVe, RamsesRewards } from '../contracts/viem';
import { RamsesRewardsContract } from '../contracts/viem/RamsesRewards';
import { RamsesVeContract } from '../contracts/viem/RamsesVe';

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

  getEscrowContract(address: string): RamsesVeContract {
    return this.contractFactory.ramsesVe({ address, network: this.network });
  }

  getRewardContract(address: string): RamsesRewardsContract {
    return this.contractFactory.ramsesRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: RamsesVeContract): Promise<string> {
    return contract.read.token();
  }

  async getRewardTokenBalance(address: string, contract: RamsesRewardsContract): Promise<BigNumberish> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const veCount = Number(await escrow.read.balanceOf([address]));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.read.tokenOfOwnerByIndex([address, BigInt(i)]);
        const balance = await contract.read.claimable([tokenId]);
        return Number(balance);
      }),
    );

    return sum(balances);
  }

  getRewardTokenAddress(contract: RamsesRewardsContract): Promise<string> {
    return contract.read.token();
  }

  async getEscrowedTokenBalance(address: string, contract: RamsesVeContract): Promise<BigNumberish> {
    const veCount = Number(await contract.read.balanceOf([address]));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await contract.read.tokenOfOwnerByIndex([address, BigInt(i)]);
        const balance = await contract.read.locked([tokenId]);
        return Number(balance[0]);
      }),
    );

    return sum(balances);
  }
}
