/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const saddleSwapAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tokenAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'fees',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'invariant',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpTokenSupply',
        type: 'uint256',
      },
    ],
    name: 'AddLiquidity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newAdminFee',
        type: 'uint256',
      },
    ],
    name: 'NewAdminFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newSwapFee',
        type: 'uint256',
      },
    ],
    name: 'NewSwapFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newWithdrawFee',
        type: 'uint256',
      },
    ],
    name: 'NewWithdrawFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldA',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newA',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'initialTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'futureTime',
        type: 'uint256',
      },
    ],
    name: 'RampA',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tokenAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpTokenSupply',
        type: 'uint256',
      },
    ],
    name: 'RemoveLiquidity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tokenAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'fees',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'invariant',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpTokenSupply',
        type: 'uint256',
      },
    ],
    name: 'RemoveLiquidityImbalance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpTokenAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpTokenSupply',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'boughtId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokensBought',
        type: 'uint256',
      },
    ],
    name: 'RemoveLiquidityOne',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentA',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'StopRampA',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokensSold',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokensBought',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'soldId',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'boughtId',
        type: 'uint128',
      },
    ],
    name: 'TokenSwap',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'minToMint',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'addLiquidity',
    outputs: [
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
        name: 'user',
        type: 'address',
      },
    ],
    name: 'calculateCurrentWithdrawFee',
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
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'calculateRemoveLiquidity',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
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
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndex',
        type: 'uint8',
      },
    ],
    name: 'calculateRemoveLiquidityOneToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'availableTokenAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'tokenIndexFrom',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexTo',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
    ],
    name: 'calculateSwap',
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
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bool',
        name: 'deposit',
        type: 'bool',
      },
    ],
    name: 'calculateTokenAmount',
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
    name: 'getA',
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
    name: 'getAPrecise',
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
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getAdminBalance',
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
    name: 'getDepositTimestamp',
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
        internalType: 'uint8',
        name: 'index',
        type: 'uint8',
      },
    ],
    name: 'getToken',
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
    inputs: [
      {
        internalType: 'uint8',
        name: 'index',
        type: 'uint8',
      },
    ],
    name: 'getTokenBalance',
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
        name: 'tokenAddress',
        type: 'address',
      },
    ],
    name: 'getTokenIndex',
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
    name: 'getVirtualPrice',
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
        internalType: 'contract IERC20[]',
        name: '_pooledTokens',
        type: 'address[]',
      },
      {
        internalType: 'uint8[]',
        name: 'decimals',
        type: 'uint8[]',
      },
      {
        internalType: 'string',
        name: 'lpTokenName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'lpTokenSymbol',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_a',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_adminFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_withdrawFee',
        type: 'uint256',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'minAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'removeLiquidity',
    outputs: [
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
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'maxBurnAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'removeLiquidityImbalance',
    outputs: [
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
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndex',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'minAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'removeLiquidityOneToken',
    outputs: [
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
        internalType: 'uint8',
        name: 'tokenIndexFrom',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'tokenIndexTo',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minDy',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swap',
    outputs: [
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
    inputs: [],
    name: 'swapStorage',
    outputs: [
      {
        internalType: 'uint256',
        name: 'initialA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'futureA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'initialATime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'futureATime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'swapFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'adminFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'defaultWithdrawFee',
        type: 'uint256',
      },
      {
        internalType: 'contract LPToken',
        name: 'lpToken',
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
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'transferAmount',
        type: 'uint256',
      },
    ],
    name: 'updateUserWithdrawFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export type SaddleSwap = typeof saddleSwapAbi;
export type SaddleSwapContract = GetContractReturnType<SaddleSwap, PublicClient>;

export class SaddleSwap__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: saddleSwapAbi, publicClient: client });
  }
}
