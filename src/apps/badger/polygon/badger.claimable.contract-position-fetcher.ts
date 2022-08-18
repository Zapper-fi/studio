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
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class PolygonBadgerClaimableContractPositionFetcher extends BadgerClaimableContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  // No DIGG token yet on arb
  diggTokenAddress = '';

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
        address: '0x2c798fafd37c7dcdcac2498e19432898bc51376b',
        rewardTokenAddress: '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a',
      },
      {
        address: '0x2c798fafd37c7dcdcac2498e19432898bc51376b',
        rewardTokenAddress: '0x172370d5cd63279efa6d502dab29171933a610af',
      },
    ];
  }
}
