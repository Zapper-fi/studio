/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { SpoolVospool, SpoolVospoolInterface } from '../SpoolVospool';

const _abi = [
  {
    inputs: [
      {
        internalType: 'contract ISpoolOwner',
        name: '_spoolOwner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_firstTrancheEndTime',
        type: 'uint256',
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
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Burned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'lastUpdatedTrancheIndex',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'totalMaturedVotingPower',
        type: 'uint48',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'totalMaturingAmount',
        type: 'uint48',
      },
      {
        indexed: false,
        internalType: 'uint56',
        name: 'totalRawUnmaturedVotingPower',
        type: 'uint56',
      },
    ],
    name: 'GlobalGradualUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'burnAll',
        type: 'bool',
      },
    ],
    name: 'GradualBurned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'GradualMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'minter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'set',
        type: 'bool',
      },
    ],
    name: 'GradualMinterSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Minted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'minter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'set',
        type: 'bool',
      },
    ],
    name: 'MinterSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint16',
        name: 'lastUpdatedTrancheIndex',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'maturedVotingPower',
        type: 'uint48',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'maturingAmount',
        type: 'uint48',
      },
      {
        indexed: false,
        internalType: 'uint56',
        name: 'rawUnmaturedVotingPower',
        type: 'uint56',
      },
    ],
    name: 'UserGradualUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'FULL_POWER_TIME',
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
    name: 'FULL_POWER_TRANCHES_COUNT',
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
    name: 'TRANCHE_TIME',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowance',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
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
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'burnAll',
        type: 'bool',
      },
    ],
    name: 'burnGradual',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'firstTrancheStartTime',
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
    name: 'getCurrentTrancheIndex',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getGlobalGradual',
    outputs: [
      {
        components: [
          {
            internalType: 'uint48',
            name: 'totalMaturedVotingPower',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'totalMaturingAmount',
            type: 'uint48',
          },
          {
            internalType: 'uint56',
            name: 'totalRawUnmaturedVotingPower',
            type: 'uint56',
          },
          {
            internalType: 'uint16',
            name: 'lastUpdatedTrancheIndex',
            type: 'uint16',
          },
        ],
        internalType: 'struct GlobalGradual',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLastFinishedTrancheIndex',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNextTrancheEndTime',
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
    name: 'getNotUpdatedGlobalGradual',
    outputs: [
      {
        components: [
          {
            internalType: 'uint48',
            name: 'totalMaturedVotingPower',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'totalMaturingAmount',
            type: 'uint48',
          },
          {
            internalType: 'uint56',
            name: 'totalRawUnmaturedVotingPower',
            type: 'uint56',
          },
          {
            internalType: 'uint16',
            name: 'lastUpdatedTrancheIndex',
            type: 'uint16',
          },
        ],
        internalType: 'struct GlobalGradual',
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
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getNotUpdatedUserGradual',
    outputs: [
      {
        components: [
          {
            internalType: 'uint48',
            name: 'maturedVotingPower',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'maturingAmount',
            type: 'uint48',
          },
          {
            internalType: 'uint56',
            name: 'rawUnmaturedVotingPower',
            type: 'uint56',
          },
          {
            components: [
              {
                internalType: 'uint16',
                name: 'arrayIndex',
                type: 'uint16',
              },
              {
                internalType: 'uint8',
                name: 'position',
                type: 'uint8',
              },
            ],
            internalType: 'struct UserTranchePosition',
            name: 'oldestTranchePosition',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint16',
                name: 'arrayIndex',
                type: 'uint16',
              },
              {
                internalType: 'uint8',
                name: 'position',
                type: 'uint8',
              },
            ],
            internalType: 'struct UserTranchePosition',
            name: 'latestTranchePosition',
            type: 'tuple',
          },
          {
            internalType: 'uint16',
            name: 'lastUpdatedTrancheIndex',
            type: 'uint16',
          },
        ],
        internalType: 'struct UserGradual',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalGradualVotingPower',
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
        internalType: 'uint256',
        name: 'trancheIndex',
        type: 'uint256',
      },
    ],
    name: 'getTrancheEndTime',
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
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'getTrancheIndex',
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
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserGradual',
    outputs: [
      {
        components: [
          {
            internalType: 'uint48',
            name: 'maturedVotingPower',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'maturingAmount',
            type: 'uint48',
          },
          {
            internalType: 'uint56',
            name: 'rawUnmaturedVotingPower',
            type: 'uint56',
          },
          {
            components: [
              {
                internalType: 'uint16',
                name: 'arrayIndex',
                type: 'uint16',
              },
              {
                internalType: 'uint8',
                name: 'position',
                type: 'uint8',
              },
            ],
            internalType: 'struct UserTranchePosition',
            name: 'oldestTranchePosition',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint16',
                name: 'arrayIndex',
                type: 'uint16',
              },
              {
                internalType: 'uint8',
                name: 'position',
                type: 'uint8',
              },
            ],
            internalType: 'struct UserTranchePosition',
            name: 'latestTranchePosition',
            type: 'tuple',
          },
          {
            internalType: 'uint16',
            name: 'lastUpdatedTrancheIndex',
            type: 'uint16',
          },
        ],
        internalType: 'struct UserGradual',
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
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserGradualVotingPower',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'gradualMinters',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'indexedGlobalTranches',
    outputs: [
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
        ],
        internalType: 'struct Tranche',
        name: 'zero',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
        ],
        internalType: 'struct Tranche',
        name: 'one',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
        ],
        internalType: 'struct Tranche',
        name: 'two',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
        ],
        internalType: 'struct Tranche',
        name: 'three',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
        ],
        internalType: 'struct Tranche',
        name: 'four',
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
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'mintGradual',
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
    name: 'minters',
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
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_gradualMinter',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_set',
        type: 'bool',
      },
    ],
    name: 'setGradualMinter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_minter',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_set',
        type: 'bool',
      },
    ],
    name: 'setMinter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalInstantPower',
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
    name: 'totalSupply',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'updateUserVotingPower',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateVotingPower',
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
    name: 'userInstantPower',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userTranches',
    outputs: [
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
          {
            internalType: 'uint16',
            name: 'index',
            type: 'uint16',
          },
        ],
        internalType: 'struct UserTranche',
        name: 'zero',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
          {
            internalType: 'uint16',
            name: 'index',
            type: 'uint16',
          },
        ],
        internalType: 'struct UserTranche',
        name: 'one',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
          {
            internalType: 'uint16',
            name: 'index',
            type: 'uint16',
          },
        ],
        internalType: 'struct UserTranche',
        name: 'two',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint48',
            name: 'amount',
            type: 'uint48',
          },
          {
            internalType: 'uint16',
            name: 'index',
            type: 'uint16',
          },
        ],
        internalType: 'struct UserTranche',
        name: 'three',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export class SpoolVospool__factory {
  static readonly abi = _abi;
  static createInterface(): SpoolVospoolInterface {
    return new utils.Interface(_abi) as SpoolVospoolInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): SpoolVospool {
    return new Contract(address, _abi, signerOrProvider) as SpoolVospool;
  }
}
