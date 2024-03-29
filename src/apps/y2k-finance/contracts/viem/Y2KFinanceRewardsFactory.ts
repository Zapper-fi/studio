/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const y2KFinanceRewardsFactoryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_govToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_factory',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'EpochDoesNotExist',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketId',
        type: 'uint256',
      },
    ],
    name: 'MarketDoesNotExist',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'marketEpochId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'mIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'hedgeFarm',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'riskFarm',
        type: 'address',
      },
    ],
    name: 'CreatedStakingReward',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_epochEnd',
        type: 'uint256',
      },
    ],
    name: 'createStakingRewards',
    outputs: [
      {
        internalType: 'address',
        name: 'insr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'risk',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
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
    name: 'govToken',
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
    name: 'owner',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export type Y2KFinanceRewardsFactory = typeof y2KFinanceRewardsFactoryAbi;
export type Y2KFinanceRewardsFactoryContract = GetContractReturnType<Y2KFinanceRewardsFactory, PublicClient>;

export class Y2KFinanceRewardsFactory__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: y2KFinanceRewardsFactoryAbi, publicClient: client });
  }
}
