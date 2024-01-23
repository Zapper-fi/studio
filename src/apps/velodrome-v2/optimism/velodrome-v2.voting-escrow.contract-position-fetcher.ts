import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { VelodromeV2ViemContractFactory } from '../contracts';
import { VelodromeV2Rewards, VelodromeV2Ve } from '../contracts/viem';
import { VelodromeV2RewardsContract } from '../contracts/viem/VelodromeV2Rewards';
import { VelodromeV2VeContract } from '../contracts/viem/VelodromeV2Ve';

@PositionTemplate()
export class OptimismVelodromeV2VotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  VelodromeV2Ve,
  VelodromeV2Rewards
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xfaf8fd17d9840595845582fcb047df13f006787d';
  rewardAddress = '0x9d4736ec60715e71afe72973f7885dcbc21ea99b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeV2ViemContractFactory) protected readonly contractFactory: VelodromeV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): VelodromeV2VeContract {
    return this.contractFactory.velodromeV2Ve({ address, network: this.network });
  }

  getRewardContract(address: string): VelodromeV2RewardsContract {
    return this.contractFactory.velodromeV2Rewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: VelodromeV2VeContract): Promise<string> {
    return contract.read.token();
  }

  async getRewardTokenBalance(address: string, contract: VelodromeV2RewardsContract): Promise<BigNumberish> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const veCount = Number(await escrow.read.balanceOf([address]));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.read.ownerToNFTokenIdList([address, BigInt(i)]);
        const balance = await contract.read.claimable([tokenId]);
        return Number(balance);
      }),
    );

    return sum(balances);
  }

  getRewardTokenAddress(contract: VelodromeV2RewardsContract): Promise<string> {
    return contract.read.token();
  }

  async getEscrowedTokenBalance(address: string, contract: VelodromeV2VeContract): Promise<BigNumberish> {
    const veCount = Number(await contract.read.balanceOf([address]));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await contract.read.ownerToNFTokenIdList([address, BigInt(i)]);
        const balance = await contract.read.locked([tokenId]);
        return Number(balance.amount);
      }),
    );

    return sum(balances);
  }
}
