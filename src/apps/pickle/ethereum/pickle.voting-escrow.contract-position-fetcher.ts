import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleVotingEscrow, PickleVotingEscrowReward } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.votingEscrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPickleVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  PickleVotingEscrow,
  PickleVotingEscrowReward
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Voting Escrow';

  veTokenAddress = '0xbbcf169ee191a1ba7371f30a1c344bfc498b29cf';
  rewardAddress = '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc';

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
}
