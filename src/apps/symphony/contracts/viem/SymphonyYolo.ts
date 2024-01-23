/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const symphonyYoloAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'AddedWhitelistToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feePercent',
        type: 'uint256',
      },
    ],
    name: 'CancellationFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
    ],
    name: 'EmergencyAdminUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'handler',
        type: 'address',
      },
    ],
    name: 'HandlerAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'handler',
        type: 'address',
      },
    ],
    name: 'HandlerRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
    ],
    name: 'OracleAddressUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountReceived',
        type: 'uint256',
      },
    ],
    name: 'OrderCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'OrderCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountReceived',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'depositPlusYield',
        type: 'uint256',
      },
    ],
    name: 'OrderExecuted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'oldOrderId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'newOrderId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'OrderUpdated',
    type: 'event',
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feePercent',
        type: 'uint256',
      },
    ],
    name: 'ProtocolFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'RemovedWhitelistToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bufferPercent',
        type: 'uint256',
      },
    ],
    name: 'TokenBufferUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'strategy',
        type: 'address',
      },
    ],
    name: 'TokenStrategyUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'txCost',
        type: 'uint256',
      },
    ],
    name: 'TokensRebalanced',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_handler',
        type: 'address',
      },
    ],
    name: 'addHandler',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'addWhitelistToken',
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
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowedExecutors',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowedHandlers',
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
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
    ],
    name: 'approveExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'orderData',
        type: 'bytes',
      },
    ],
    name: 'cancelOrder',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depositPlusYield',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cancellationFeePercent',
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
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stoplossAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'executionFee',
        type: 'uint256',
      },
    ],
    name: 'createNativeOrder',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'orderData',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
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
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stoplossAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'executionFee',
        type: 'uint256',
      },
    ],
    name: 'createOrder',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'orderData',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'orderData',
        type: 'bytes',
      },
    ],
    name: 'decodeOrder',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'inputToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'outputToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'inputAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minReturnAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stoplossAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'executor',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'executionFee',
            type: 'uint256',
          },
        ],
        internalType: 'struct IOrderStructs.Order',
        name: 'order',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyAdmin',
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
        internalType: 'address[]',
        name: '_tokens',
        type: 'address[]',
      },
    ],
    name: 'emergencyWithdrawFromStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'orderData',
        type: 'bytes',
      },
      {
        internalType: 'address payable',
        name: 'handler',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'handlerData',
        type: 'bytes',
      },
    ],
    name: 'executeOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'orderData',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'quoteAmount',
        type: 'uint256',
      },
    ],
    name: 'fillOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stoplossAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'executionFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'blockTimestamp',
        type: 'uint256',
      },
    ],
    name: 'getOrderId',
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
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'contractBalance',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenStrategy',
        type: 'address',
      },
    ],
    name: 'getTotalTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalTokens',
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
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_emergencyAdmin',
        type: 'address',
      },
      {
        internalType: 'contract IOracle',
        name: '_oracle',
        type: 'address',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_newStrategy',
        type: 'address',
      },
    ],
    name: 'migrateStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oracle',
    outputs: [
      {
        internalType: 'contract IOracle',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'orderHash',
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
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
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
    name: 'protocolFeePercent',
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
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
    ],
    name: 'rebalanceTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_handler',
        type: 'address',
      },
    ],
    name: 'removeHandler',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'removeWhitelistToken',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
    ],
    name: 'revokeExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_strategy',
        type: 'address',
      },
    ],
    name: 'setStrategy',
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
    name: 'strategy',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'tokenBuffer',
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
    name: 'totalTokenShares',
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
    name: 'treasury',
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
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_feePercent',
        type: 'uint256',
      },
    ],
    name: 'updateCancellationFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_emergencyAdmin',
        type: 'address',
      },
    ],
    name: 'updateEmergencyAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IOracle',
        name: '_oracle',
        type: 'address',
      },
    ],
    name: 'updateOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'orderId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'orderData',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stoplossAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'executionFee',
        type: 'uint256',
      },
    ],
    name: 'updateOrder',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'newOrderId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'newOrderData',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_feePercent',
        type: 'uint256',
      },
    ],
    name: 'updateProtocolFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_bufferPercent',
        type: 'uint256',
      },
    ],
    name: 'updateTokenBuffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address',
      },
    ],
    name: 'updateTreasury',
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
    name: 'whitelistedTokens',
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
] as const;

export type SymphonyYolo = typeof symphonyYoloAbi;
export type SymphonyYoloContract = GetContractReturnType<SymphonyYolo, PublicClient>;

export class SymphonyYolo__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: symphonyYoloAbi, publicClient: client });
  }
}
