/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { PlutusRewardsDistroPlsJones, PlutusRewardsDistroPlsJonesInterface } from '../PlutusRewardsDistroPlsJones';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pendingRewards',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_staker',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_pls',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_plsDpx',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_plsJones',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_jones',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'UNAUTHORIZED',
    type: 'error',
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
    inputs: [],
    name: 'getEmissions',
    outputs: [
      {
        internalType: 'uint80',
        name: 'pls_',
        type: 'uint80',
      },
      {
        internalType: 'uint80',
        name: 'plsDpx_',
        type: 'uint80',
      },
      {
        internalType: 'uint80',
        name: 'plsJones_',
        type: 'uint80',
      },
      {
        internalType: 'uint80',
        name: 'jones_',
        type: 'uint80',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'harvestFromUnderlyingFarm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'jones',
    outputs: [
      {
        internalType: 'contract IERC20',
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
    name: 'pendingRewards',
    outputs: [
      {
        internalType: 'contract IPendingRewards',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pls',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'plsDpx',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'plsDpxPerSecond',
    outputs: [
      {
        internalType: 'uint80',
        name: '',
        type: 'uint80',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'plsJones',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'plsJonesPerSecond',
    outputs: [
      {
        internalType: 'uint80',
        name: '',
        type: 'uint80',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'plsPerSecond',
    outputs: [
      {
        internalType: 'uint80',
        name: '',
        type: 'uint80',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'plutusChef',
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
        internalType: 'contract IERC20',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'retrieve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardsController',
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
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint128',
        name: '_plsAmt',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: '_plsDpxAmt',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: '_plsJonesAmt',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: '_jonesAmt',
        type: 'uint128',
      },
    ],
    name: 'sendRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newPlutusChef',
        type: 'address',
      },
    ],
    name: 'setPlutusChef',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newController',
        type: 'address',
      },
    ],
    name: 'setRewardsController',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'staker',
    outputs: [
      {
        internalType: 'contract IJonesStaker',
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
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateInfo',
    outputs: [
      {
        internalType: 'uint80',
        name: 'pls_',
        type: 'uint80',
      },
      {
        internalType: 'uint80',
        name: 'plsDpx_',
        type: 'uint80',
      },
      {
        internalType: 'uint80',
        name: 'plsJones_',
        type: 'uint80',
      },
      {
        internalType: 'uint80',
        name: 'pendingJonesLessFee_',
        type: 'uint80',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint80',
        name: '_newPlsDpxRate',
        type: 'uint80',
      },
    ],
    name: 'updatePlsDpxEmissions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint80',
        name: '_newPlsRate',
        type: 'uint80',
      },
    ],
    name: 'updatePlsEmission',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint80',
        name: '_newPlsJonesRate',
        type: 'uint80',
      },
    ],
    name: 'updatePlsJonesEmissions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export class PlutusRewardsDistroPlsJones__factory {
  static readonly abi = _abi;
  static createInterface(): PlutusRewardsDistroPlsJonesInterface {
    return new utils.Interface(_abi) as PlutusRewardsDistroPlsJonesInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): PlutusRewardsDistroPlsJones {
    return new Contract(address, _abi, signerOrProvider) as PlutusRewardsDistroPlsJones;
  }
}
