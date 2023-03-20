import { Inject, NotImplementedException } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

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

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const stakingRewardContract = this.contractFactory.stakingRewards({
      address: this.stakingRewardAddress,
      network: this.network,
    });

    const xsLockerContract = this.contractFactory.xsLocker({
      address: this.xsLockerAddress,
      network: this.network,
    });

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const numPositionsRaw = await multicall.wrap(xsLockerContract).balanceOf(address);

    const balances = await Promise.all(
      range(0, numPositionsRaw.toNumber()).map(async index => {
        const lockId = await multicall.wrap(xsLockerContract).tokenOfOwnerByIndex(address, index);

        const lock = await multicall.wrap(xsLockerContract).locks(lockId);
        const rewardAmount = await multicall.wrap(stakingRewardContract).pendingRewardsOfLock(lockId);

        const suppliedAmount = drillBalance(contractPositions[0].tokens[0], lock.amount.toString());
        const claimableBalance = drillBalance(contractPositions[0].tokens[1], rewardAmount.toString());

        return {
          ...contractPositions[0],
          tokens: [suppliedAmount, claimableBalance],
          balanceUSD: suppliedAmount.balanceUSD + claimableBalance.balanceUSD,
        };
      }),
    );

    return balances;
  }
}
