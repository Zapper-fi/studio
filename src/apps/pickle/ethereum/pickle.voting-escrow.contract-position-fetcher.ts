import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleVotingEscrow } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.votingEscrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPickleVotingEscrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PickleVotingEscrow> {
  appId = appId;
  groupId = groupId;
  network = network;
  rewardsAddress = '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PickleVotingEscrow {
    return this.contractFactory.pickleVotingEscrow({ address, network });
  }

  async getDescriptors() {
    return [{ address: '0xbbcf169ee191a1ba7371f30a1c344bfc498b29cf' }];
  }

  async getTokenDescriptors({ contract, multicall }: TokenStageParams<PickleVotingEscrow>) {
    const _reward = this.contractFactory.pickleVotingEscrowReward({
      address: this.rewardsAddress,
      network: this.network,
    });

    const reward = multicall.wrap(_reward);
    const stakedTokenAddress = await contract.token();
    const rewardTokenAddress = await reward.token();

    return [
      { metaType: MetaType.SUPPLIED, address: stakedTokenAddress },
      { metaType: MetaType.CLAIMABLE, address: rewardTokenAddress },
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<PickleVotingEscrow>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesPerPositionParams<PickleVotingEscrow>) {
    const _reward = this.contractFactory.pickleVotingEscrowReward({
      address: this.rewardsAddress,
      network: this.network,
    });

    const reward = multicall.wrap(_reward);
    return Promise.all([contract.locked(address).then(v => v.amount), reward.callStatic['claim()']({ from: address })]);
  }
}
