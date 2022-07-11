import { BigNumber, BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isSupplied, isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import type { VaultContractPositionDataProps } from '../types';

export async function getXVaultBalances<T>({
  accountAddress,
  appToolkit,
  network,
  appId,
  groupIds,
  resolveContract,
  resolveUserInfo,
  resolveClaimableTokenBalance,
}: {
  accountAddress: string;
  appToolkit: IAppToolkit;
  network: Network;
  appId: string;
  groupIds: string[];
  resolveContract: (opts: { contractAddress: string; network: Network }) => T;
  resolveUserInfo: (opts: {
    contract: T;
    multicall: IMulticallWrapper;
    network: Network;
    accountAddress: string;
  }) => Promise<{
    poolId: BigNumberish;
    active: boolean;
    amount: BigNumberish;
  }[]>;
  resolveClaimableTokenBalance: (opts: {
    contract: T;
    multicall: IMulticallWrapper;
    network: Network;
    accountAddress: string;
  }) => Promise<BigNumberish>;
}) {
  const multicall = appToolkit.getMulticall(network);
  const contractPositions = await appToolkit.getAppContractPositions<VaultContractPositionDataProps>({
    network,
    appId,
    groupIds,
  });

  const balances = await Promise.all(
    contractPositions.map(async contractPosition => {
      const contract = resolveContract({ contractAddress: contractPosition.address, network });

      const stakedToken = contractPosition.tokens.find(isSupplied);
      const claimableToken = contractPosition.tokens.find(isClaimable);

      const stakedTokenBalances =
        stakedToken && !contractPosition.dataProps.isClaimable ?
          (await resolveUserInfo({
            multicall, contract, network, accountAddress,
          })).filter(
          stake => Number(stake.poolId) === contractPosition.dataProps.poolIndex && stake.active
          ).map(stake => {
            const balanceRaw = stake.amount;
            return drillBalance(stakedToken, balanceRaw.toString());
          }) : [];

      const claimableTokenBalances =
        claimableToken && contractPosition.dataProps.isClaimable ?
          [
            drillBalance(claimableToken, BigNumber.from(await resolveClaimableTokenBalance({ multicall, contract, network, accountAddress })).toString())
          ] : [];

      const tokens = [...stakedTokenBalances, ...claimableTokenBalances].filter(v => v.balanceUSD > 0);

      return {
        ...contractPosition,
        balanceUSD: tokens.reduce((p, c) => p + c.balanceUSD, 0),
        tokens,
      };
    }),
  );

  return balances;
}
