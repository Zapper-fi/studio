import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SolaceContractFactory, XsLocker } from '../contracts';

export abstract class SolaceXslockerContractPositionFetcher extends ContractPositionTemplatePositionFetcher<XsLocker> {
  abstract xsLockerAddress: string;
  abstract stakingRewardAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) protected readonly contractFactory: SolaceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): XsLocker {
    return this.contractFactory.xsLocker({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: this.xsLockerAddress }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<XsLocker>) {
    const solaceAddressRaw = await contract.solace();
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: solaceAddressRaw.toLowerCase(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: solaceAddressRaw.toLowerCase(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contract }: GetDisplayPropsParams<XsLocker>) {
    return contract.name();
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<XsLocker>) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const stakingRewardContract = this.contractFactory.stakingRewards({
      address: this.stakingRewardAddress,
      network: this.network,
    });

    const numPositionsRaw = await contract.balanceOf(address);

    const balances = await Promise.all(
      range(0, numPositionsRaw.toNumber()).map(async index => {
        const lockId = await contract.tokenOfOwnerByIndex(address, index);

        const lock = await contract.locks(lockId);
        const rewardAmount = await multicall.wrap(stakingRewardContract).pendingRewardsOfLock(lockId);

        return {
          supplied: lock.amount,
          claimable: rewardAmount,
        };
      }),
    );

    const supplied = balances.map(x => Number(x.supplied));
    const claimables = balances.map(x => Number(x.claimable));

    return [supplied, claimables];
  }
}
