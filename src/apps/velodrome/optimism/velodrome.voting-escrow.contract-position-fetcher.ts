import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { VelodromeViemContractFactory } from '../contracts';
import { VelodromeVe, VelodromeRewards } from '../contracts/viem';
import { VelodromeRewardsContract } from '../contracts/viem/VelodromeRewards';
import { VelodromeVeContract } from '../contracts/viem/VelodromeVe';

@PositionTemplate()
export class OptimismVelodromeVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  VelodromeVe,
  VelodromeRewards
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x9c7305eb78a432ced5c4d14cac27e8ed569a2e26';
  rewardAddress = '0x5d5bea9f0fc13d967511668a60a3369fd53f784f';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeViemContractFactory) protected readonly contractFactory: VelodromeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): VelodromeVeContract {
    return this.contractFactory.velodromeVe({ address, network: this.network });
  }

  getRewardContract(address: string): VelodromeRewardsContract {
    return this.contractFactory.velodromeRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: VelodromeVeContract): Promise<string> {
    return contract.read.token();
  }

  async getRewardTokenBalance(address: string, contract: VelodromeRewardsContract): Promise<BigNumberish> {
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

  getRewardTokenAddress(contract: VelodromeRewardsContract): Promise<string> {
    return contract.read.token();
  }

  async getEscrowedTokenBalance(address: string, contract: VelodromeVeContract): Promise<BigNumberish> {
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
