import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall } from '~multicall';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveContractFactory as ContractFactory } from '../contracts';

import { CurveVotingEscrowContractPositionDataProps } from './curve.voting-escrow.contract-position-helper';

type CurveVotingEscrowContractPositionBalanceHelperParams<T, V = null> = {
  address: string;
  appId: string;
  groupId: string;
  network: Network;
  resolveContract: (opts: { contractFactory: ContractFactory; network: Network; address: string }) => T;
  resolveRewardContract?: (opts: { contractFactory: ContractFactory; network: Network; address: string }) => V;
  resolveLockedTokenBalance: (opts: {
    contract: T;
    multicall: EthersMulticall;
    address: string;
  }) => Promise<BigNumberish>;
  resolveRewardTokenBalance?: (opts: {
    contract: V;
    multicall: EthersMulticall;
    address: string;
  }) => Promise<BigNumberish>;
};

@Injectable()
export class CurveVotingEscrowContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ContractFactory) private readonly contractFactory: ContractFactory,
  ) {}

  async getBalances<T, V = null>({
    address,
    appId,
    groupId,
    network,
    resolveContract,
    resolveRewardContract,
    resolveLockedTokenBalance,
    resolveRewardTokenBalance,
  }: CurveVotingEscrowContractPositionBalanceHelperParams<T, V>): Promise<ContractPositionBalance[]> {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);
    const contractPositions = await this.appToolkit.getAppContractPositions<CurveVotingEscrowContractPositionDataProps>(
      {
        network,
        appId,
        groupIds: [groupId],
      },
    );

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const lockedToken = contractPosition.tokens.find(token => token.metaType === MetaType.SUPPLIED);
        const rewardToken = contractPosition.tokens.find(token => token.metaType === MetaType.CLAIMABLE);
        if (!lockedToken) return null;

        // Resolve escrowed token
        const contract = resolveContract({ contractFactory, network, address: contractPosition.address });
        const lockedTokenBalanceRaw = await resolveLockedTokenBalance({ contract, multicall, address });
        const lockedTokenBalance = drillBalance(lockedToken, lockedTokenBalanceRaw.toString());
        const tokens = [lockedTokenBalance];

        if (rewardToken && resolveRewardContract && resolveRewardTokenBalance) {
          const rewardAddress = contractPosition.dataProps.rewardAddress!;
          const rewardContract = resolveRewardContract({ contractFactory, network, address: rewardAddress });
          const rewardTokenBalanceRaw = await resolveRewardTokenBalance({
            contract: rewardContract,
            multicall,
            address,
          });
          const rewardTokenBalance = drillBalance(rewardToken, rewardTokenBalanceRaw.toString());
          tokens.push(rewardTokenBalance);
        }

        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        return { ...contractPosition, tokens, balanceUSD };
      }),
    );

    return compact(balances);
  }
}
