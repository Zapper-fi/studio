/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { RariFusePoolLens, RariFusePoolLensInterface } from '../RariFusePoolLens';

const _abi = [
  {
    inputs: [],
    name: 'directory',
    outputs: [
      {
        internalType: 'contract FusePoolDirectory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'contract FusePoolDirectory',
        name: '_directory',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPublicPoolsWithData',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'comptroller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockPosted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestampPosted',
            type: 'uint256',
          },
        ],
        internalType: 'struct FusePoolDirectory.FusePool[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'address[][]',
        name: '',
        type: 'address[][]',
      },
      {
        internalType: 'string[][]',
        name: '',
        type: 'string[][]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'getPoolsByAccountWithData',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'comptroller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockPosted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestampPosted',
            type: 'uint256',
          },
        ],
        internalType: 'struct FusePoolDirectory.FusePool[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'address[][]',
        name: '',
        type: 'address[][]',
      },
      {
        internalType: 'string[][]',
        name: '',
        type: 'string[][]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract Comptroller',
        name: 'comptroller',
        type: 'address',
      },
    ],
    name: 'getPoolSummary',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract Comptroller',
        name: 'comptroller',
        type: 'address',
      },
    ],
    name: 'getPoolAssetsWithData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'cToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'underlyingToken',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'underlyingName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingSymbol',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'underlyingDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'supplyRatePerBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'borrowRatePerBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalBorrow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'supplyBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'borrowBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidity',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'membership',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'exchangeRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingPrice',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'oracle',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'collateralFactor',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactor',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'adminFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fuseFee',
            type: 'uint256',
          },
        ],
        internalType: 'struct FusePoolLens.FusePoolAsset[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'maxHealth',
        type: 'uint256',
      },
    ],
    name: 'getPublicPoolUsersWithData',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalBorrow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalCollateral',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'health',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'cToken',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'underlyingToken',
                type: 'address',
              },
              {
                internalType: 'string',
                name: 'underlyingName',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'underlyingSymbol',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'underlyingDecimals',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'underlyingBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'supplyRatePerBlock',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'borrowRatePerBlock',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'totalBorrow',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'supplyBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'borrowBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'membership',
                type: 'bool',
              },
              {
                internalType: 'uint256',
                name: 'exchangeRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'underlyingPrice',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'oracle',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'collateralFactor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'reserveFactor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'adminFee',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fuseFee',
                type: 'uint256',
              },
            ],
            internalType: 'struct FusePoolLens.FusePoolAsset[]',
            name: 'assets',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct FusePoolLens.FusePoolUser[][]',
        name: '',
        type: 'tuple[][]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract Comptroller[]',
        name: 'comptrollers',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'maxHealth',
        type: 'uint256',
      },
    ],
    name: 'getPoolUsersWithData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalBorrow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalCollateral',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'health',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'cToken',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'underlyingToken',
                type: 'address',
              },
              {
                internalType: 'string',
                name: 'underlyingName',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'underlyingSymbol',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'underlyingDecimals',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'underlyingBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'supplyRatePerBlock',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'borrowRatePerBlock',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'totalBorrow',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'supplyBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'borrowBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'membership',
                type: 'bool',
              },
              {
                internalType: 'uint256',
                name: 'exchangeRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'underlyingPrice',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'oracle',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'collateralFactor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'reserveFactor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'adminFee',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fuseFee',
                type: 'uint256',
              },
            ],
            internalType: 'struct FusePoolLens.FusePoolAsset[]',
            name: 'assets',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct FusePoolLens.FusePoolUser[][]',
        name: '',
        type: 'tuple[][]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract Comptroller',
        name: 'comptroller',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'maxHealth',
        type: 'uint256',
      },
    ],
    name: 'getPoolUsersWithData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalBorrow',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalCollateral',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'health',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'cToken',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'underlyingToken',
                type: 'address',
              },
              {
                internalType: 'string',
                name: 'underlyingName',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'underlyingSymbol',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'underlyingDecimals',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'underlyingBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'supplyRatePerBlock',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'borrowRatePerBlock',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'totalBorrow',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'supplyBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'borrowBalance',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'membership',
                type: 'bool',
              },
              {
                internalType: 'uint256',
                name: 'exchangeRate',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'underlyingPrice',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'oracle',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'collateralFactor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'reserveFactor',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'adminFee',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fuseFee',
                type: 'uint256',
              },
            ],
            internalType: 'struct FusePoolLens.FusePoolAsset[]',
            name: 'assets',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct FusePoolLens.FusePoolUser[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
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
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getPoolsBySupplier',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'comptroller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockPosted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestampPosted',
            type: 'uint256',
          },
        ],
        internalType: 'struct FusePoolDirectory.FusePool[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getPoolsBySupplierWithData',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'comptroller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockPosted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestampPosted',
            type: 'uint256',
          },
        ],
        internalType: 'struct FusePoolDirectory.FusePool[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'address[][]',
        name: '',
        type: 'address[][]',
      },
      {
        internalType: 'string[][]',
        name: '',
        type: 'string[][]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
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
    name: 'getUserSummary',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
        internalType: 'contract Comptroller',
        name: 'comptroller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getPoolUserSummary',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
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
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getWhitelistedPoolsByAccount',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'comptroller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockPosted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestampPosted',
            type: 'uint256',
          },
        ],
        internalType: 'struct FusePoolDirectory.FusePool[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getWhitelistedPoolsByAccountWithData',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'comptroller',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockPosted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestampPosted',
            type: 'uint256',
          },
        ],
        internalType: 'struct FusePoolDirectory.FusePool[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'address[][]',
        name: '',
        type: 'address[][]',
      },
      {
        internalType: 'string[][]',
        name: '',
        type: 'string[][]',
      },
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract Comptroller',
        name: 'comptroller',
        type: 'address',
      },
    ],
    name: 'getPoolOwnership',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'cToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'admin',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'adminHasRights',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'fuseAdminHasRights',
            type: 'bool',
          },
        ],
        internalType: 'struct FusePoolLens.CTokenOwnership[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
];

export class RariFusePoolLens__factory {
  static readonly abi = _abi;
  static createInterface(): RariFusePoolLensInterface {
    return new utils.Interface(_abi) as RariFusePoolLensInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): RariFusePoolLens {
    return new Contract(address, _abi, signerOrProvider) as RariFusePoolLens;
  }
}
