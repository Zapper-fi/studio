/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type {
  EthSkinnySkinnyOptimisticOracle,
  EthSkinnySkinnyOptimisticOracleInterface,
} from '../EthSkinnySkinnyOptimisticOracle';

const _abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_liveness',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_finderAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_timerAddress',
        type: 'address',
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
        name: 'requester',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'DisputePrice',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'ProposePrice',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'RequestPrice',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'Settle',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ancillaryBytesLimit',
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
    name: 'defaultLiveness',
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
        name: 'requester',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'disputePrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalBond',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'disputer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
    ],
    name: 'disputePriceFor',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalBond',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'finder',
    outputs: [
      {
        internalType: 'contract FinderInterface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentTime',
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
        name: 'requester',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'getState',
    outputs: [
      {
        internalType: 'enum OptimisticOracleInterface.State',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'hasPrice',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
      {
        internalType: 'int256',
        name: 'proposedPrice',
        type: 'int256',
      },
    ],
    name: 'proposePrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalBond',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'proposer',
        type: 'address',
      },
      {
        internalType: 'int256',
        name: 'proposedPrice',
        type: 'int256',
      },
    ],
    name: 'proposePriceFor',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalBond',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        internalType: 'contract IERC20',
        name: 'currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'bond',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'customLiveness',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'proposer',
        type: 'address',
      },
      {
        internalType: 'int256',
        name: 'proposedPrice',
        type: 'int256',
      },
    ],
    name: 'requestAndProposePriceFor',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalBond',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        internalType: 'contract IERC20',
        name: 'currency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'bond',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'customLiveness',
        type: 'uint256',
      },
    ],
    name: 'requestPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalBond',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'requests',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'setCurrentTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'identifier',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'proposer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'disputer',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'settled',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'proposedPrice',
            type: 'int256',
          },
          {
            internalType: 'int256',
            name: 'resolvedPrice',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expirationTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'finalFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bond',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'customLiveness',
            type: 'uint256',
          },
        ],
        internalType: 'struct SkinnyOptimisticOracleInterface.Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'settle',
    outputs: [
      {
        internalType: 'uint256',
        name: 'payout',
        type: 'uint256',
      },
      {
        internalType: 'int256',
        name: 'resolvedPrice',
        type: 'int256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'ancillaryData',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
    ],
    name: 'stampAncillaryData',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'timerAddress',
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
];

export class EthSkinnySkinnyOptimisticOracle__factory {
  static readonly abi = _abi;
  static createInterface(): EthSkinnySkinnyOptimisticOracleInterface {
    return new utils.Interface(_abi) as EthSkinnySkinnyOptimisticOracleInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): EthSkinnySkinnyOptimisticOracle {
    return new Contract(address, _abi, signerOrProvider) as EthSkinnySkinnyOptimisticOracle;
  }
}
