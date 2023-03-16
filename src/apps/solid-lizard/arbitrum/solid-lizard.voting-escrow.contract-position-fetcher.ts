import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { SolidLizardContractFactory, SolidLizardVe, SolidLizardRewards } from '../contracts';

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
    @Inject(SolidLizardContractFactory) protected readonly contractFactory: SolidLizardContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): SolidLizardVe {
    return this.contractFactory.solidLizardVe({ address, network: this.network });
  }

  getRewardContract(address: string): SolidLizardRewards {
    return this.contractFactory.solidLizardRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: SolidLizardVe): Promise<string> {
    return contract.token();
  }

  async getRewardTokenBalance(address: string, contract: SolidLizardRewards): Promise<BigNumberish> {
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

  getRewardTokenAddress(contract: SolidLizardRewards): Promise<string> {
    return contract.token();
  }

  async getEscrowedTokenBalance(address: string, contract: SolidLizardVe): Promise<BigNumberish> {
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
