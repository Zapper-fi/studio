/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { LlamapayVestingEscrow, LlamapayVestingEscrowInterface } from '../LlamapayVestingEscrow';

const _abi = [
  {
    name: 'Fund',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Claim',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
      },
      {
        name: 'claimed',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'RugPull',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rugged',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'CommitOwnership',
    inputs: [
      {
        name: 'admin',
        type: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'ApplyOwnership',
    inputs: [
      {
        name: 'admin',
        type: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'admin',
        type: 'address',
      },
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'recipient',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'start_time',
        type: 'uint256',
      },
      {
        name: 'end_time',
        type: 'uint256',
      },
      {
        name: 'cliff_length',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    gas: 402331,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'unclaimed',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 26060,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'locked',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 26120,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'claim',
    inputs: [],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'claim',
    inputs: [
      {
        name: 'beneficiary',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'claim',
    inputs: [
      {
        name: 'beneficiary',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'rug_pull',
    inputs: [],
    outputs: [],
    gas: 72184,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_transfer_ownership',
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
    ],
    outputs: [],
    gas: 39595,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'apply_transfer_ownership',
    inputs: [],
    outputs: [],
    gas: 59523,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'renounce_ownership',
    inputs: [],
    outputs: [],
    gas: 44555,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'collect_dust',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
    outputs: [],
    gas: 14120,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'recipient',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 2658,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'token',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 2688,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'start_time',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2718,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'end_time',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2748,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'cliff_length',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2778,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'total_locked',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2808,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'total_claimed',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2838,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'disabled_at',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2868,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initialized',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    gas: 2898,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 2928,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_admin',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 2958,
  },
];

export class LlamapayVestingEscrow__factory {
  static readonly abi = _abi;
  static createInterface(): LlamapayVestingEscrowInterface {
    return new utils.Interface(_abi) as LlamapayVestingEscrowInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): LlamapayVestingEscrow {
    return new Contract(address, _abi, signerOrProvider) as LlamapayVestingEscrow;
  }
}
