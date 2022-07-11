import { BigNumber, BigNumberish } from 'ethers';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import type { VaultContractPositionDataProps } from '../types';

const ONE_DAY = 60 * 60 * 24;

export async function fetchXVaultPositions<T>({
  appToolkit,
  network,
  appId,
  groupId,
  dependencies = [],
  address,
  resolveContract,
  resolveDepositTokenAddress,
  resolvePoolLength,
  resolveRewardTokenAddresses,
  resolvePoolInfo,
}: {
  appToolkit: IAppToolkit;
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  address: string;
  resolveContract: (opts: { address: string; network: Network }) => T;
  resolveDepositTokenAddress: (opts: {
    contract: T;
    multicall: IMulticallWrapper;
    network: Network;
  }) => Promise<string>;
  resolvePoolLength: (opts: {
    network: Network;
    contract: T;
    multicall: IMulticallWrapper;
  }) => BigNumberish | Promise<BigNumberish>;
  resolveRewardTokenAddresses: (opts: {
    contract: T;
    multicall: IMulticallWrapper;
    network: Network;
  }) => Promise<string | string[]>;
  resolvePoolInfo: (opts: {
    contract: T;
    multicall: IMulticallWrapper;
    network: Network;
    poolIndex: number;
  }) => Promise<{
    multiplier: BigNumberish;
    lockPeriod: BigNumberish;
    totalStaked: BigNumberish;
  }>;
}): Promise<ContractPosition<VaultContractPositionDataProps>[]> {
  const multicall = appToolkit.getMulticall(network);
  const contract = resolveContract({ address, network });
  const depositTokenAddress = await resolveDepositTokenAddress({ contract, multicall, network });
  const appTokens = await appToolkit.getAppTokenPositions(...dependencies);
  const depositToken = appTokens.find(t => t.address === depositTokenAddress.toLowerCase());
  if (!depositToken) return [];

  const poolLength = Number(await resolvePoolLength({ contract, multicall, network }));
  const claimablePoolIndex = poolLength; // additional position as pending claimable

  return appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<T>({
    network,
    groupId,
    appId,
    address,
    dependencies,
    resolveContract: () => contract,
    resolvePoolLength: () => poolLength + 1,
    resolveDepositTokenAddress: async () => depositTokenAddress,
    resolveRewardTokenAddresses,
  })
  .then(
    positions => Promise.all(
      positions.map(async position => {
        if (position.dataProps.poolIndex !== claimablePoolIndex) {
          const { multiplier, lockPeriod, totalStaked } = await resolvePoolInfo({
            contract, multicall, network, poolIndex: position.dataProps.poolIndex,
          });

          return {
            ...position,
            dataProps: {
              ...position.dataProps,
              isActive: true,
              isClaimable: false,
              poolInfo: {
                multiplier: BigNumber.from(multiplier).toNumber(),
                lockPeriod: BigNumber.from(lockPeriod).toNumber(),
                totalStaked: BigNumber.from(totalStaked).toNumber() / Math.pow(10, depositToken.decimals),
              },
            },
            displayProps: {
              ...position.displayProps,
              label: getLabel(lockPeriod),
            },
          };
        } else {
          return {
            ...position,
            dataProps: {
              ...position.dataProps,
              isActive: true,
              isClaimable: true,
            },
            displayProps: {
              ...position.displayProps,
              label: 'Pending Vault Reward',
            },
          };
        }
      }),
    ),
  );
}

function getLabel(lockPeriod: BigNumberish): string {
  const lockPeriodDays = BigNumber.from(lockPeriod).toNumber() / ONE_DAY;

  if (lockPeriodDays >= 365) {
    return `${Math.floor(lockPeriodDays / 365)} Years Vault`;
  } else if (lockPeriodDays >= 30) {
    return `${Math.floor(lockPeriodDays / 30)} Months Vault`;
  } else {
    return `${Math.floor(lockPeriodDays)} Days Vault`;
  }
}
