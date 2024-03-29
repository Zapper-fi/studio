/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const illuviumCorePoolAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_ilv',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_silv',
        type: 'address',
      },
      {
        internalType: 'contract IlluviumPoolFactory',
        name: '_factory',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_poolToken',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: '_initBlock',
        type: 'uint64',
      },
      {
        internalType: 'uint32',
        name: '_weight',
        type: 'uint32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_fromVal',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_toVal',
        type: 'uint32',
      },
    ],
    name: 'PoolWeightUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'depositId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'lockedFrom',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'lockedUntil',
        type: 'uint64',
      },
    ],
    name: 'StakeLockUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'yieldRewardsPerWeight',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'lastYieldDistribution',
        type: 'uint64',
      },
    ],
    name: 'Synchronized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Unstaked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'VaultRewardsClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'VaultRewardsReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_fromVal',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_toVal',
        type: 'address',
      },
    ],
    name: 'VaultUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_by',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'sIlv',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'YieldClaimed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'blockNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'contract IlluviumPoolFactory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_depositId',
        type: 'uint256',
      },
    ],
    name: 'getDeposit',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'weight',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'lockedFrom',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'lockedUntil',
            type: 'uint64',
          },
          {
            internalType: 'bool',
            name: 'isYield',
            type: 'bool',
          },
        ],
        internalType: 'struct IPool.Deposit',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getDepositsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ilv',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isFlashPool',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastYieldDistribution',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'now256',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_staker',
        type: 'address',
      },
    ],
    name: 'pendingVaultRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: 'pending',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_staker',
        type: 'address',
      },
    ],
    name: 'pendingYieldRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolTokenReserve',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_useSILV',
        type: 'bool',
      },
    ],
    name: 'processRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_rewardsAmount',
        type: 'uint256',
      },
    ],
    name: 'receiveVaultRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rewardPerWeight',
        type: 'uint256',
      },
    ],
    name: 'rewardToWeight',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
    ],
    name: 'setVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '_weight',
        type: 'uint32',
      },
    ],
    name: 'setWeight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'silv',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: '_lockUntil',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: '_useSILV',
        type: 'bool',
      },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_staker',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'stakeAsPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sync',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_depositId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_useSILV',
        type: 'bool',
      },
    ],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'depositId',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: 'lockedUntil',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: 'useSILV',
        type: 'bool',
      },
    ],
    name: 'updateStakeLock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'users',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalWeight',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'subYieldRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'subVaultRewards',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usersLockingWeight',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vault',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vaultRewardsPerWeight',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'weight',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_weight',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rewardPerWeight',
        type: 'uint256',
      },
    ],
    name: 'weightToReward',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'yieldRewardsPerWeight',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export type IlluviumCorePool = typeof illuviumCorePoolAbi;
export type IlluviumCorePoolContract = GetContractReturnType<IlluviumCorePool, PublicClient>;

export class IlluviumCorePool__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: illuviumCorePoolAbi, publicClient: client });
  }
}
