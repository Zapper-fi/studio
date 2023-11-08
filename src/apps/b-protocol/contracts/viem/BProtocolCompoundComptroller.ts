/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const bProtocolCompoundComptrollerAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_comptroller',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'cToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'bToken',
        type: 'address',
      },
    ],
    name: 'NewBToken',
    type: 'event',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'b2c',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'c2b',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'holder',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'bTokens',
        type: 'address[]',
      },
    ],
    name: 'claimComp',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address[]',
        name: 'holders',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: 'bTokens',
        type: 'address[]',
      },
      {
        internalType: 'bool',
        name: 'borrowers',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'suppliers',
        type: 'bool',
      },
    ],
    name: 'claimComp',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'holder',
        type: 'address',
      },
    ],
    name: 'claimComp',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'comptroller',
    outputs: [
      {
        internalType: 'contract IComptroller',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'bToken',
        type: 'address',
      },
    ],
    name: 'enterMarket',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'contract IAvatar',
        name: 'avatar',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'bToken',
        type: 'address',
      },
    ],
    name: 'enterMarketOnAvatar',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address[]',
        name: 'bTokens',
        type: 'address[]',
      },
    ],
    name: 'enterMarkets',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'contract IAvatar',
        name: 'avatar',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'bTokens',
        type: 'address[]',
      },
    ],
    name: 'enterMarketsOnAvatar',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'bToken',
        type: 'address',
      },
    ],
    name: 'exitMarket',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'contract IAvatar',
        name: 'avatar',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'bToken',
        type: 'address',
      },
    ],
    name: 'exitMarketOnAvatar',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getAccountLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'err',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'shortFall',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getAllMarkets',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'bToken',
        type: 'address',
      },
    ],
    name: 'isBToken',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'cToken',
        type: 'address',
      },
    ],
    name: 'newBToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'oracle',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'registry',
    outputs: [
      {
        internalType: 'contract IRegistry',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_registry',
        type: 'address',
      },
    ],
    name: 'setRegistry',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export type BProtocolCompoundComptroller = typeof bProtocolCompoundComptrollerAbi;
export type BProtocolCompoundComptrollerContract = GetContractReturnType<BProtocolCompoundComptroller, PublicClient>;

export class BProtocolCompoundComptroller__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: bProtocolCompoundComptrollerAbi, publicClient: client });
  }
}
