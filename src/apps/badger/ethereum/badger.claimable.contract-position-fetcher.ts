import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerContractFactory } from '../contracts';
import {
  BadgerClaimableContractPositionFetcher,
  BadgerClaimableDescriptor,
} from '../helpers/badger.claimable.contract-position-fetcher';
import { BadgerClaimableRewardsResolver } from '../helpers/badger.claimable.rewards-resolver';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.claimable.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumBadgerClaimableContractPositionFetcher extends BadgerClaimableContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  diggTokenAddress = '0x798d1be841a82a273720ce31c822c61a67a601c3';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BadgerContractFactory) protected readonly contractFactory: BadgerContractFactory,
    @Inject(BadgerClaimableRewardsResolver) protected badgerClaimableRewardsResolver: BadgerClaimableRewardsResolver,
  ) {
    super(appToolkit, contractFactory, badgerClaimableRewardsResolver);
  }

  async getDescriptors(): Promise<BadgerClaimableDescriptor[]> {
    return [
      {
        address: '0x660802fc641b154aba66a62137e71f331b6d787a',
        rewardTokenAddress: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
      },
      {
        address: '0x660802fc641b154aba66a62137e71f331b6d787a',
        rewardTokenAddress: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
      },
      {
        address: '0x660802fc641b154aba66a62137e71f331b6d787a',
        rewardTokenAddress: '0x798d1be841a82a273720ce31c822c61a67a601c3',
      },
      {
        address: '0x660802fc641b154aba66a62137e71f331b6d787a',
        rewardTokenAddress: '0xa0246c9032bc3a600820415ae600c6388619a14d',
      },
    ];
  }
}
