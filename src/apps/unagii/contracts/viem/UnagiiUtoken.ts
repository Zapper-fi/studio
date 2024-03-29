/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const unagiiUtokenAbi = [
  {
    name: 'Transfer',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Approval',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'SetNextTimeLock',
    inputs: [
      {
        name: 'timeLock',
        type: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'AcceptTimeLock',
    inputs: [
      {
        name: 'timeLock',
        type: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'SetMinter',
    inputs: [
      {
        name: 'minter',
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
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'setName',
    inputs: [
      {
        name: 'name',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'setSymbol',
    inputs: [
      {
        name: 'symbol',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'setNextTimeLock',
    inputs: [
      {
        name: 'nextTimeLock',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'acceptTimeLock',
    inputs: [],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'setMinter',
    inputs: [
      {
        name: 'minter',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'transfer',
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'approve',
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'increaseAllowance',
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'decreaseAllowance',
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'permit',
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'deadline',
        type: 'uint256',
      },
      {
        name: 'v',
        type: 'uint256',
      },
      {
        name: 'r',
        type: 'bytes32',
      },
      {
        name: 's',
        type: 'bytes32',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'mint',
    inputs: [
      {
        name: '_to',
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
    name: 'burn',
    inputs: [
      {
        name: '_from',
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
    stateMutability: 'view',
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
      {
        name: 'arg1',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'nonces',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'DOMAIN_SEPARATOR',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'timeLock',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'nextTimeLock',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'minter',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
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
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'lastBlock',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
] as const;

export type UnagiiUtoken = typeof unagiiUtokenAbi;
export type UnagiiUtokenContract = GetContractReturnType<UnagiiUtoken, PublicClient>;

export class UnagiiUtoken__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: unagiiUtokenAbi, publicClient: client });
  }
}
