/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { OokiTokenRegistry, OokiTokenRegistryInterface } from '../OokiTokenRegistry';

const _abi = [
  {
    constant: true,
    inputs: [],
    name: 'bZxContract',
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
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_count',
        type: 'uint256',
      },
    ],
    name: 'getTokens',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'asset',
            type: 'address',
          },
        ],
        internalType: 'struct TokenRegistry.TokenMetadata[]',
        name: 'metadata',
        type: 'tuple[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export class OokiTokenRegistry__factory {
  static readonly abi = _abi;
  static createInterface(): OokiTokenRegistryInterface {
    return new utils.Interface(_abi) as OokiTokenRegistryInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): OokiTokenRegistry {
    return new Contract(address, _abi, signerOrProvider) as OokiTokenRegistry;
  }
}
