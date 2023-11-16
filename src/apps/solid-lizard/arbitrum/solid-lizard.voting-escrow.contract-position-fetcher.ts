import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { SolidLizardViemContractFactory } from '../contracts';
import { SolidLizardVe, SolidLizardRewards } from '../contracts/viem';
import { SolidLizardRewardsContract } from '../contracts/viem/SolidLizardRewards';
import { SolidLizardVeContract } from '../contracts/viem/SolidLizardVe';

@PositionTemplate()
export class ArbitrumSolidLizardVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  SolidLizardVe,
  SolidLizardRewards
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x29d3622c78615a1e7459e4be434d816b7de293e4';
  rewardAddress = '0xbfa51d9635fa9be5117093efeff06d388d539b86';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolidLizardViemContractFactory) protected readonly contractFactory: SolidLizardViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): SolidLizardVeContract {
    return this.contractFactory.solidLizardVe({ address, network: this.network });
  }

  getRewardContract(address: string): SolidLizardRewardsContract {
    return this.contractFactory.solidLizardRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: SolidLizardVeContract): Promise<string> {
    return contract.read.token();
  }

  async getRewardTokenBalance(address: string, contract: SolidLizardRewardsContract): Promise<BigNumberish> {
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

  getRewardTokenAddress(contract: SolidLizardRewardsContract): Promise<string> {
    return contract.read.token();
  }

  async getEscrowedTokenBalance(address: string, contract: SolidLizardVeContract): Promise<BigNumberish> {
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
