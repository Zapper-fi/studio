import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';

import { PickleViemContractFactory } from '../contracts';
import { PickleVotingEscrow, PickleVotingEscrowReward } from '../contracts/viem';
import { PickleVotingEscrowContract } from '../contracts/viem/PickleVotingEscrow';
import { PickleVotingEscrowRewardContract } from '../contracts/viem/PickleVotingEscrowReward';
import { PickleVotingEscrowRewardV2Contract } from '../contracts/viem/PickleVotingEscrowRewardV2';

@PositionTemplate()
export class EthereumPickleVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  PickleVotingEscrow,
  PickleVotingEscrowReward
> {
  groupLabel = 'Voting Escrow';

  veTokenAddress = '0xbbcf169ee191a1ba7371f30a1c344bfc498b29cf';
  rewardAddress = '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc';
  rewardV2Address = '0x2c6c87e7e6195ab7a4f19d3cf31d867580bb2a1b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleViemContractFactory) protected readonly contractFactory: PickleViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string) {
    return this.contractFactory.pickleVotingEscrow({ address, network: this.network });
  }

  getRewardContract(address: string) {
    return this.contractFactory.pickleVotingEscrowReward({ address, network: this.network });
  }

  getEscrowedTokenAddress(contract: PickleVotingEscrowContract): Promise<string> {
    return contract.read.token();
  }

  getRewardTokenAddress(contract: PickleVotingEscrowRewardContract): Promise<string> {
    return contract.read.token();
  }

  getEscrowedTokenBalance(address: string, contract: PickleVotingEscrowContract): Promise<BigNumberish> {
    return contract.read.locked([address]).then(v => v[0]);
  }

  getRewardTokenBalance(address: string, contract: PickleVotingEscrowRewardContract): Promise<BigNumberish> {
    return contract.simulate.claim({ account: address }).then(v => v.result);
  }

  // Overriding template methods to accomodate dual rewards & new rewarder address

  async getTokenDefinitions({ multicall }: GetTokenDefinitionsParams<PickleVotingEscrow>) {
    const escrow = multicall.wrap(this.getEscrowContract(this.veTokenAddress));
    const reward = multicall.wrap(this.getRewardContract(this.rewardAddress));

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await this.getEscrowedTokenAddress(escrow),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await this.getRewardTokenAddress(reward),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: ZERO_ADDRESS,
        network: this.network,
      },
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
    contract: PickleVotingEscrowRewardContract,
    contract2: PickleVotingEscrowRewardV2Contract,
  ): Promise<[BigNumberish, BigNumberish]> {
    const pickleV1Claim = await contract.simulate.claim({ account: address }).then(v => v.result);
    const v2Rewards = await contract2.simulate.claim({ account: address }).then(v => v.result);
    return [BigNumber.from(pickleV1Claim).add(v2Rewards[0]), BigNumber.from(v2Rewards[1])];
  }
}
