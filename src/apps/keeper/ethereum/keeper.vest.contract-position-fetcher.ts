import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { KeeperViemContractFactory } from '../contracts';
import { KeeperVest } from '../contracts/viem';
import { KeeperVestContract } from '../contracts/viem/KeeperVest';

@PositionTemplate()
export class EthereumKeeperVestContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<KeeperVest> {
  groupLabel = 'Vesting';
  veTokenAddress = '0x2fc52c61fb0c03489649311989ce2689d93dc1a2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KeeperViemContractFactory) protected readonly contractFactory: KeeperViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): KeeperVestContract {
    return this.contractFactory.keeperVest({ address, network: this.network });
  }

  getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<KeeperVest>) {
    return contract.read.token();
  }

  getEscrowedTokenBalance({ address, contract }: GetTokenBalancesParams<KeeperVest>) {
    return contract.read.balanceOf([address]);
  }
}
