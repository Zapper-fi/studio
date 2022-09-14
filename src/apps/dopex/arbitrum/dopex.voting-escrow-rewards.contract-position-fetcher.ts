import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { DopexContractFactory, DopexVotingEscrowRewards } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

@Injectable()
export class ArbitrumDopexVotingEscrowRewardsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<DopexVotingEscrowRewards> {
  appId = DOPEX_DEFINITION.id;
  groupId = DOPEX_DEFINITION.groups.votingEscrowRewards.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Voting Escrow Rewards';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DopexContractFactory) protected readonly contractFactory: DopexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DopexVotingEscrowRewards {
    return this.contractFactory.dopexVotingEscrowRewards({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xcbbfb7e0e6782df0d3e91f8d785a5bf9e8d9775f' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<DopexVotingEscrowRewards>) {
    return [{ metaType: MetaType.CLAIMABLE, address: await contract.emittedToken() }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<DopexVotingEscrowRewards>) {
    const suppliedToken = contractPosition.tokens.find(isClaimable)!;
    return `Voting Escrow ${getLabelFromToken(suppliedToken)} Rewards`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<DopexVotingEscrowRewards>) {
    return [await contract.earned(address)];
  }
}
