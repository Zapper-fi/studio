import { Inject, Injectable } from '@nestjs/common';
import { sum, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { VelodromeContractFactory, VelodromeVe } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

@Injectable()
export class OptimismVelodromeVotingEscrowContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<VelodromeVe> {
  appId = VELODROME_DEFINITION.id;
  groupId = VELODROME_DEFINITION.groups.votingEscrow.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Voting Escrow';
  veTokenAddress = '0x9c7305eb78a432ced5c4d14cac27e8ed569a2e26';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) protected readonly contractFactory: VelodromeContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): VelodromeVe {
    return this.contractFactory.velodromeVe({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<VelodromeVe>) {
    return contract.token();
  }

  async getEscrowedTokenBalance({ contract, address }: GetTokenBalancesParams<VelodromeVe>) {
    const veCount = Number(await contract.balanceOf(address));

    const balances = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const balance = await contract.balanceOfNFT(tokenId);
        return Number(balance);
      }),
    );

    return sum(balances);
  }
}
