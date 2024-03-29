/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const makerProxyRegistryAbi = [
  {
    constant: false,
    inputs: [],
    name: 'build',
    outputs: [
      {
        name: 'proxy',
        type: 'address',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'proxies',
    outputs: [
      {
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
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'build',
    outputs: [
      {
        name: 'proxy',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        name: 'factory_',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
] as const;

export type MakerProxyRegistry = typeof makerProxyRegistryAbi;
export type MakerProxyRegistryContract = GetContractReturnType<MakerProxyRegistry, PublicClient>;

export class MakerProxyRegistry__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: makerProxyRegistryAbi, publicClient: client });
  }
}
