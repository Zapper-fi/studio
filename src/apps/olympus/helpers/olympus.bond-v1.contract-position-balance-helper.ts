import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition } from '~position/position.interface';
import { isClaimable, isVesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

type OlympusBondV1ContractPositionBalanceHelperParams<T, V> = {
  address: string;
  appId: string;
  groupId: string;
  network: Network;
  resolveDepositoryContract: (opts: { depositoryAddress: string; network: Network }) => T;
  resolveTotalPayout: (opts: {
    multicall: Multicall;
    contract: T;
    address: string;
    contractPosition: ContractPosition<V>;
  }) => Promise<BigNumberish>;
  resolveClaimablePayout: (opts: {
    multicall: Multicall;
    contract: T;
    address: string;
    contractPosition: ContractPosition<V>;
  }) => Promise<BigNumberish>;
};

@Injectable()
export class OlympusBondV1ContractPositionBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T, V = DefaultDataProps>(
    opts: OlympusBondV1ContractPositionBalanceHelperParams<T, V>,
  ): Promise<ContractPositionBalance<V>[]> {
    const { address, appId, groupId, network, resolveDepositoryContract, resolveTotalPayout, resolveClaimablePayout } =
      opts;

    const multicall = this.appToolkit.getMulticall(network);
    const contractPositions = await this.appToolkit.getAppContractPositions<V>({ network, appId, groupIds: [groupId] });

    const contractPositionBalances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = resolveDepositoryContract({ depositoryAddress: contractPosition.address, network });

        const vestingToken = contractPosition.tokens.find(isVesting)!;
        const claimableToken = contractPosition.tokens.find(isClaimable)!;

        const [pendingPayoutRaw, claimableBalanceRaw] = await Promise.all([
          resolveTotalPayout({ multicall, contract, address, contractPosition }),
          resolveClaimablePayout({ multicall, contract, address, contractPosition }),
        ]);

        const pendingPayoutRawBN = new BigNumber(pendingPayoutRaw.toString());
        const claimableBalanceRawBN = new BigNumber(claimableBalanceRaw.toString());

        const vestingBalanceRaw = pendingPayoutRawBN.gt(claimableBalanceRawBN)
          ? pendingPayoutRawBN.minus(claimableBalanceRawBN).toFixed(0)
          : '0';
        const claimableTokenBalance = drillBalance(claimableToken, claimableBalanceRaw.toString());
        const vestingTokenBalance = drillBalance(vestingToken, vestingBalanceRaw);
        const tokens = [claimableTokenBalance, vestingTokenBalance].filter(v => v.balanceUSD > 0);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return { ...contractPosition, tokens, balanceUSD };
      }),
    );

    return contractPositionBalances;
  }
}
