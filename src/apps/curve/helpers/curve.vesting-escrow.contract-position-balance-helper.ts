import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isClaimable, isVesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CurveContractFactory as ContractFactory } from '../contracts';

type CurveVestingEscrowContractPositionBalanceHelperParams<T> = {
  address: string;
  appId: string;
  groupId: string;
  network: Network;
  resolveContract: (opts: { contractFactory: ContractFactory; address: string }) => T;
  resolveUnlockedBalance: (opts: { contract: T; multicall: IMulticallWrapper; address: string }) => Promise<BigNumber>;
  resolveLockedBalance: (opts: { contract: T; multicall: IMulticallWrapper; address: string }) => Promise<BigNumber>;
};

@Injectable()
export class CurveVestingEscrowContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ContractFactory)
    private readonly contractFactory: ContractFactory,
  ) {}

  async getBalances<T>({
    address,
    appId,
    groupId,
    network,
    resolveContract,
    resolveUnlockedBalance,
    resolveLockedBalance,
  }: CurveVestingEscrowContractPositionBalanceHelperParams<T>): Promise<ContractPositionBalance[]> {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);
    const contractPositions = await this.appToolkit.getAppContractPositions({
      network,
      appId,
      groupIds: [groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const claimableToken = contractPosition.tokens.find(isClaimable);
        const vestingToken = contractPosition.tokens.find(isVesting);
        if (!claimableToken || !vestingToken) return null;

        // Resolve locked and unlocked balances
        const contract = resolveContract({ contractFactory, address: contractPosition.address });
        const unlockedBalanceRaw = await resolveUnlockedBalance({ contract, multicall, address });
        const lockedBalanceRaw = await resolveLockedBalance({ contract, multicall, address });
        const tokens = [
          drillBalance(claimableToken, unlockedBalanceRaw.toString()),
          drillBalance(vestingToken, lockedBalanceRaw.toString()),
        ].filter(v => v.balanceUSD > 0);

        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        return { ...contractPosition, tokens, balanceUSD };
      }),
    );

    return compact(balances);
  }
}
