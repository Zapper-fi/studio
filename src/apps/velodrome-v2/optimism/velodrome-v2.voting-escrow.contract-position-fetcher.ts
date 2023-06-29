import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { VelodromeV2ContractFactory, VelodromeVe, VelodromeRewards } from '../contracts';

@PositionTemplate()
export class OptimismVelodromeV2VotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  VelodromeVe,
  VelodromeRewards
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0xfaf8fd17d9840595845582fcb047df13f006787d';
  rewardAddress = '0x9d4736ec60715e71afe72973f7885dcbc21ea99b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeV2ContractFactory) protected readonly contractFactory: VelodromeV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): VelodromeVe {
    return this.contractFactory.velodromeVe({ address, network: this.network });
  }

  getRewardContract(address: string): VelodromeRewards {
    return this.contractFactory.velodromeRewards({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: VelodromeVe): Promise<string> {
    return contract.token();
  }

  async getRewardTokenBalance(address: string, contract: VelodromeRewards): Promise<BigNumberish> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const veCount = Number(await escrow.balanceOf(address));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.ownerToNFTokenIdList(address, i);
        const balance = await contract.claimable(tokenId);
        return Number(balance);
      }),
    );

    return sum(balances);
  }

  getRewardTokenAddress(contract: VelodromeRewards): Promise<string> {
    return contract.token();
  }

  async getEscrowedTokenBalance(address: string, contract: VelodromeVe): Promise<BigNumberish> {
    const veCount = Number(await contract.balanceOf(address));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await contract.ownerToNFTokenIdList(address, i);
        const balance = await contract.locked(tokenId);
        return Number(balance.amount);
      }),
    );

    return sum(balances);
  }
}
