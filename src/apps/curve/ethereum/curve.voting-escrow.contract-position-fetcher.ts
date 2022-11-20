import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { VotingEscrowWithRewardsTemplateContractPositionFetcher } from '~position/template/voting-escrow-with-rewards.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveVotingEscrow, CurveVotingEscrowReward } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.votingEscrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumCurveVotingEscrowContractPositionFetcher extends VotingEscrowWithRewardsTemplateContractPositionFetcher<
  CurveVotingEscrow,
  CurveVotingEscrowReward
> {
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x5f3b5dfeb7b28cdbd7faba78963ee202a494e2a2';
  rewardAddress = '0xa464e6dcda8ac41e03616f95f4bc98a13b8922dc';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): CurveVotingEscrow {
    return this.contractFactory.curveVotingEscrow({ address, network: this.network });
  }

  getRewardContract(address: string): CurveVotingEscrowReward {
    return this.contractFactory.curveVotingEscrowReward({ address, network: this.network });
  }

  async getEscrowedTokenAddress(contract: CurveVotingEscrow) {
    return contract.token();
  }

  async getRewardTokenAddress(contract: CurveVotingEscrowReward) {
    return contract.token();
  }

  async getEscrowedTokenBalance(address: string, contract: CurveVotingEscrow) {
    return contract.locked(address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, contract: CurveVotingEscrowReward) {
    return contract.callStatic['claim()']({ from: address });
  }
}
