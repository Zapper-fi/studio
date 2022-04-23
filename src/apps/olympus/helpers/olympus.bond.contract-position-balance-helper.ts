import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition } from '~position/position.interface';
import { isClaimable, isVesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

type OlympusBondContractPositionBalanceHelperParams<T, V> = {
  address: string;
  appId: string;
  groupId: string;
  network: Network;
  resolveDepositoryContract: (opts: { depositoryAddress: string; network: Network }) => T;
  resolveClaimablePayout: (opts: {
    multicall: Multicall;
    contract: T;
    address: string;
    contractPosition: ContractPosition<V>;
  }) => Promise<any>;
};

@Injectable()
export class OlympusBondContractPositionBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T, V = DefaultDataProps>(
    opts: OlympusBondContractPositionBalanceHelperParams<T, V>,
  ): Promise<ContractPositionBalance<V>[]> {
    const { address, appId, groupId, network, resolveDepositoryContract, resolveClaimablePayout } = opts;
    const multicall = this.appToolkit.getMulticall(network);
    const contractPositions = await this.appToolkit.getAppContractPositions<V>({ network, appId, groupIds: [groupId] });
    const contractPositionBalances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = resolveDepositoryContract({ depositoryAddress: contractPosition.address, network });
        const vestingToken = contractPosition.tokens.find(isVesting)!;
        const claimableToken = contractPosition.tokens.find(isClaimable)!;

        const [claimableBalanceRaw] = await Promise.all([
          resolveClaimablePayout({ multicall, contract, address, contractPosition }),
        ]);

        const claimableBonds = claimableBalanceRaw.filter(p => p.matured_);
        const vestingBonds = claimableBalanceRaw.filter(p => !p.matured_);

        const claimableAmount = claimableBonds.reduce((acc, bond) => acc.add(bond.payout_), BigNumber.from('0'));
        const vestingAmount = vestingBonds.reduce((acc, bond) => {
          return acc.add(bond.payout_);
        }, BigNumber.from('0'));
        const claimableTokenBalance = drillBalance(claimableToken, claimableAmount.toString());
        const vestingTokenBalance = drillBalance(vestingToken, vestingAmount.toString());
        const tokens = [claimableTokenBalance, vestingTokenBalance].filter(v => v.balanceUSD > 0);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return { ...contractPosition, tokens, balanceUSD };
      }),
    );

    return contractPositionBalances;
  }
}
