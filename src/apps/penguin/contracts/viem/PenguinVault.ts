/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const penguinVaultAbi = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      {
        type: 'string',
        name: '_name',
        internalType: 'string',
      },
      {
        type: 'address[8]',
        name: '_initAddressArray',
        internalType: 'address[8]',
      },
      {
        type: 'uint256',
        name: '_pid',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: '_minTokensToReinvest',
        internalType: 'uint256',
      },
      {
        type: 'uint256[4]',
        name: '_initFeeStructure',
        internalType: 'uint256[4]',
      },
      {
        type: 'address[]',
        name: '_pathRewardToToken0',
        internalType: 'address[]',
      },
      {
        type: 'address[]',
        name: '_pathRewardToToken1',
        internalType: 'address[]',
      },
      {
        type: 'address',
        name: '_pefiGlobalVariables',
        internalType: 'address',
      },
      {
        type: 'bool',
        name: '_USE_GLOBAL_PEFI_VARIABLES',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ClaimedxPEFI',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DepositsEnabled',
    inputs: [
      {
        type: 'bool',
        name: 'newValue',
        internalType: 'bool',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FeeStructureUpdated',
    inputs: [
      {
        type: 'uint256',
        name: 'newPOOL_CREATOR_FEE_BIPS',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'newNEST_FEE_BIPS',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'newDEV_FEE_BIPS',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'newALTERNATE_FEE_BIPS',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NestStakingBipsChanged',
    inputs: [
      {
        type: 'uint256',
        name: 'oldNEST_STAKING_BIPS',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'newNEST_STAKING_BIPS',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        type: 'address',
        name: 'previousOwner',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'newOwner',
        internalType: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Recovered',
    inputs: [
      {
        type: 'address',
        name: 'token',
        internalType: 'address',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Reinvest',
    inputs: [
      {
        type: 'uint256',
        name: 'newTotalDeposits',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'newTotalSupply',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StakedPEFI',
    inputs: [
      {
        type: 'uint256',
        name: 'amountPefiSentToNest',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdateAlternateAddress',
    inputs: [
      {
        type: 'address',
        name: 'oldValue',
        internalType: 'address',
        indexed: false,
      },
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdateDevAddress',
    inputs: [
      {
        type: 'address',
        name: 'oldValue',
        internalType: 'address',
        indexed: false,
      },
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdateMaxTokensToDepositWithoutReinvest',
    inputs: [
      {
        type: 'uint256',
        name: 'oldValue',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'newValue',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdateMinTokensToReinvest',
    inputs: [
      {
        type: 'uint256',
        name: 'oldValue',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'newValue',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdateNestAddress',
    inputs: [
      {
        type: 'address',
        name: 'oldValue',
        internalType: 'address',
        indexed: false,
      },
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdatePoolCreatorAddress',
    inputs: [
      {
        type: 'address',
        name: 'oldValue',
        internalType: 'address',
        indexed: false,
      },
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UseGlobalVariablesUpdated',
    inputs: [
      {
        type: 'bool',
        name: 'newValue',
        internalType: 'bool',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdraw',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'ALTERNATE_FEE_BIPS',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'ALTERNATE_FEE_BIPS_LOCAL',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'DEPOSITS_ENABLED',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'DEV_FEE_BIPS',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'DEV_FEE_BIPS_LOCAL',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bytes32',
        name: '',
        internalType: 'bytes32',
      },
    ],
    name: 'DOMAIN_TYPEHASH',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'MAX_TOKENS_TO_DEPOSIT_WITHOUT_REINVEST',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'MAX_TOTAL_FEE',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'MIN_TOKENS_TO_REINVEST',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'NEST_FEE_BIPS',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'NEST_FEE_BIPS_LOCAL',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'NEST_STAKING_BIPS',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bytes32',
        name: '',
        internalType: 'bytes32',
      },
    ],
    name: 'PERMIT_TYPEHASH',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'PID',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'POOL_CREATOR_FEE_BIPS',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'POOL_CREATOR_FEE_BIPS_LOCAL',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'USE_GLOBAL_PEFI_VARIABLES',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bytes32',
        name: '',
        internalType: 'bytes32',
      },
    ],
    name: 'VERSION_HASH',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'allowance',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'alternateAddress',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'alternateAddressLocal',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'approve',
    inputs: [
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'balanceOf',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'checkReward',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'claimXPEFI',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint8',
        name: '',
        internalType: 'uint8',
      },
    ],
    name: 'decimals',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'deposit',
    inputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'depositFor',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'contract IERC20',
      },
    ],
    name: 'depositToken',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'depositWithPermit',
    inputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'deadline',
        internalType: 'uint256',
      },
      {
        type: 'uint8',
        name: 'v',
        internalType: 'uint8',
      },
      {
        type: 'bytes32',
        name: 'r',
        internalType: 'bytes32',
      },
      {
        type: 'bytes32',
        name: 's',
        internalType: 'bytes32',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'devAddress',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'devAddressLocal',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'estimateDeployedBalance',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'estimateReinvestReward',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'getDepositTokensForShares',
    inputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bytes32',
        name: '',
        internalType: 'bytes32',
      },
    ],
    name: 'getDomainSeparator',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'getSharesForDepositTokens',
    inputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'impromptuTokenAggregation',
    inputs: [
      {
        type: 'uint256',
        name: 'minReturnAmountAccepted',
        internalType: 'uint256',
      },
      {
        type: 'bool',
        name: 'disableDeposits',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    name: 'name',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'nestAddress',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'nestAddressLocal',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'nonces',
    inputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'owner',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'contract PenguinStrategyGlobalVariables',
      },
    ],
    name: 'pefiGlobalVariableContract',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'pendingXPefi',
    inputs: [
      {
        type: 'address',
        name: 'user',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'permit',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'deadline',
        internalType: 'uint256',
      },
      {
        type: 'uint8',
        name: 'v',
        internalType: 'uint8',
      },
      {
        type: 'bytes32',
        name: 'r',
        internalType: 'bytes32',
      },
      {
        type: 'bytes32',
        name: 's',
        internalType: 'bytes32',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'poolCreatorAddress',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'recoverAVAX',
    inputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'recoverERC20',
    inputs: [
      {
        type: 'address',
        name: 'tokenAddress',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'tokenAmount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'reinvest',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'renounceOwnership',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'revokeAllowance',
    inputs: [
      {
        type: 'address',
        name: 'token',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'contract IERC20',
      },
    ],
    name: 'rewardToken',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'contract IRouter',
      },
    ],
    name: 'router',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setAllowances',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'stakingContract',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    name: 'symbol',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'token0',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
    name: 'token1',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'totalDeposits',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'totalSupply',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'transfer',
    inputs: [
      {
        type: 'address',
        name: 'dst',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'transferFrom',
    inputs: [
      {
        type: 'address',
        name: 'src',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'dst',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferOwnership',
    inputs: [
      {
        type: 'address',
        name: 'newOwner',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateAlternateAddress',
    inputs: [
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateDepositsEnabled',
    inputs: [
      {
        type: 'bool',
        name: 'newValue',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateDevAddress',
    inputs: [
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateFeeStructure',
    inputs: [
      {
        type: 'uint256',
        name: 'newPOOL_CREATOR_FEE_BIPS',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'newNEST_FEE_BIPS',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'newDEV_FEE_BIPS',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'newALTERNATE_FEE_BIPS',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateMaxTokensToDepositWithoutReinvest',
    inputs: [
      {
        type: 'uint256',
        name: 'newValue',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateMinTokensToReinvest',
    inputs: [
      {
        type: 'uint256',
        name: 'newValue',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateNestAddress',
    inputs: [
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateNestStakingBips',
    inputs: [
      {
        type: 'uint256',
        name: 'newNEST_STAKING_BIPS',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updatePoolCreatorAddress',
    inputs: [
      {
        type: 'address',
        name: 'newValue',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateUseGlobalVariables',
    inputs: [
      {
        type: 'bool',
        name: 'newValue',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdraw',
    inputs: [
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'xPefiDebt',
    inputs: [
      {
        type: 'address',
        name: '',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'xPefiPerShare',
    inputs: [],
  },
] as const;

export type PenguinVault = typeof penguinVaultAbi;
export type PenguinVaultContract = GetContractReturnType<PenguinVault, PublicClient>;

export class PenguinVault__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: penguinVaultAbi, publicClient: client });
  }
}
