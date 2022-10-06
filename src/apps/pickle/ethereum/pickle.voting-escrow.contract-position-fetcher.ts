import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import {
  PickleContractFactory,
  PickleVotingEscrow,
  PickleVotingEscrowReward,
  PickleVotingEscrowRewardV2,
} from '../contracts';

@PositionTemplate()
export class EthereumPickleVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  PickleVotingEscrow,
  PickleVotingEscrowReward
> {
  groupLabel = 'Voting Escrow';

  veTokenAddress = '0xbbcf169ee191a1ba7371f30a1c344bfc498b29cf';
  rewardAddress = '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc';
  rewardV2Address = '0x2c6C87E7E6195ab7A4f19d3CF31D867580Bb2a1b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): PickleVotingEscrow {
    return this.contractFactory.pickleVotingEscrow({ address, network: this.network });
  }

  getRewardContract(address: string): PickleVotingEscrowReward {
    return this.contractFactory.pickleVotingEscrowReward({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: PickleVotingEscrow): Promise<string> {
    return contract.token();
  }

  getRewardTokenAddress(contract: PickleVotingEscrowReward): Promise<string> {
    return contract.token();
  }

  getEscrowedTokenBalance(address: string, contract: PickleVotingEscrow): Promise<BigNumberish> {
    return contract.locked(address).then(v => v.amount);
  }

  getRewardTokenBalance(address: string, contract: PickleVotingEscrowReward): Promise<BigNumberish> {
    return contract.callStatic['claim()']({ from: address });
  }

  // Overriding template methods to accomodate dual rewards & new rewarder address

  async getTokenDefinitions({ multicall }: GetTokenDefinitionsParams<PickleVotingEscrow>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));

    return [
      { metaType: MetaType.SUPPLIED, address: await this.getEscrowedTokenAddress(escrow) },
      { metaType: MetaType.CLAIMABLE, address: await this.getRewardTokenAddress(reward) },
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS },
    ];
  }

  async getTokenBalancesPerPosition({ address, multicall }: GetTokenBalancesParams<PickleVotingEscrow>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));
    const rewardV2 = multicall.wrap(
      this.contractFactory.pickleVotingEscrowRewardV2({ address: this.rewardV2Address, network: this.network }),
    );

    return [
      await this.getEscrowedTokenBalance(address, escrow),
      ...(await this.getRewardTokenBalances(address, reward, rewardV2)),
    ];
  }

  async getRewardTokenBalances(
    address: string,
    contract: PickleVotingEscrowReward,
    contract2: PickleVotingEscrowRewardV2,
  ): Promise<[BigNumberish, BigNumberish]> {
    const pickleV1Claim = await contract.callStatic['claim()']({ from: address });
    const v2Rewards: [BigNumberish, BigNumberish] = await contract2.callStatic['claim()']({ from: address });
    return [pickleV1Claim.add(v2Rewards[0]), v2Rewards[1]];
  }
}
