import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { VelodromeContractFactory, VelodromeVe, VelodromeRewards } from '../contracts';

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
    @Inject(VelodromeContractFactory) protected readonly contractFactory: VelodromeContractFactory,
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

  async getRewardTokenBalance(address: string): Promise<BigNumberish> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const veCount = Number(await escrow.balanceOf(address));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.tokenOfOwnerByIndex(address, i);
        const balance = await escrow.balanceOfNFT(tokenId);
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
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const balance = await contract.locked(tokenId);
        return Number(balance.amount);
      }),
    );

    return sum(balances);
  }
}
