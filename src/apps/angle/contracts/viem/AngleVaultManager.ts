/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const angleVaultManagerAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'dust_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'dustCollateral_',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ApprovalToCaller',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ApprovalToOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DebtCeilingExceeded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DustyLeftoverAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExpiredDeadline',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HealthyVault',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IncompatibleLengths',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsolventVault',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidParameterType',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidParameterValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSetOfParameters',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSignature',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTreasury',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NonERC721Receiver',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NonexistentVault',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotApproved',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotGovernor',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotGovernorOrGuardian',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotTreasury',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotVaultManager',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotWhitelisted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Paused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TooHighParameterValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TooSmallParameterValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'surplusEndValue',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'badDebtEndValue',
        type: 'uint256',
      },
    ],
    name: 'AccruedToTreasury',
    type: 'event',
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
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
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
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'collateralAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'isIncrease',
        type: 'uint8',
      },
    ],
    name: 'CollateralAmountUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'debtCeiling',
        type: 'uint256',
      },
    ],
    name: 'DebtCeilingUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'srcVaultID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'dstVaultID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'dstVaultManager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'DebtTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'param',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'what',
        type: 'bytes32',
      },
    ],
    name: 'FiledUint64',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'InterestAccumulatorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'internalAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'isIncrease',
        type: 'uint8',
      },
    ],
    name: 'InternalDebtUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'vaultIDs',
        type: 'uint256[]',
      },
    ],
    name: 'LiquidatedVaults',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_veBoostProxy',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'xBoost',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'yBoost',
        type: 'uint256[]',
      },
    ],
    name: 'LiquidationBoostParametersUpdated',
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
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BASE_INTEREST',
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
    name: 'BASE_PARAMS',
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
    name: 'DOMAIN_SEPARATOR',
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
    name: 'HALF_BASE_INTEREST',
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
    name: 'accrueInterestToTreasury',
    outputs: [
      {
        internalType: 'uint256',
        name: 'surplusValue',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'badDebtValue',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum ActionType[]',
        name: 'actions',
        type: 'uint8[]',
      },
      {
        internalType: 'bytes[]',
        name: 'datas',
        type: 'bytes[]',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'angle',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stablecoinAmountToGive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stablecoinAmountToReceive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'collateralAmountToGive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'collateralAmountToReceive',
            type: 'uint256',
          },
        ],
        internalType: 'struct PaymentData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum ActionType[]',
        name: 'actions',
        type: 'uint8[]',
      },
      {
        internalType: 'bytes[]',
        name: 'datas',
        type: 'bytes[]',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'who',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'repayData',
        type: 'bytes',
      },
    ],
    name: 'angle',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stablecoinAmountToGive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stablecoinAmountToReceive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'collateralAmountToGive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'collateralAmountToReceive',
            type: 'uint256',
          },
        ],
        internalType: 'struct PaymentData',
        name: 'paymentData',
        type: 'tuple',
      },
    ],
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
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'badDebt',
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
        name: 'owner',
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
    inputs: [],
    name: 'borrowFee',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'liquidator',
        type: 'address',
      },
    ],
    name: 'checkLiquidation',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'maxStablecoinAmountToRepay',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxCollateralAmountGiven',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'thresholdRepayAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'discount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'currentDebt',
            type: 'uint256',
          },
        ],
        internalType: 'struct LiquidationOpportunity',
        name: 'liqOpp',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collateral',
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
    inputs: [],
    name: 'collateralFactor',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'toVault',
        type: 'address',
      },
    ],
    name: 'createVault',
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
    name: 'debtCeiling',
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
    name: 'dust',
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
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
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
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'getControlledVaults',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
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
        name: 'vaultID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stablecoinAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'senderBorrowFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'senderRepayFee',
        type: 'uint256',
      },
    ],
    name: 'getDebtOut',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalDebt',
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
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'getVaultDebt',
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
        internalType: 'contract ITreasury',
        name: '_treasury',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: '_collateral',
        type: 'address',
      },
      {
        internalType: 'contract IOracle',
        name: '_oracle',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'debtCeiling',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'collateralFactor',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'targetHealthFactor',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'interestRate',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'liquidationSurcharge',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'maxLiquidationDiscount',
            type: 'uint64',
          },
          {
            internalType: 'bool',
            name: 'whitelistingActivated',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'baseBoost',
            type: 'uint256',
          },
        ],
        internalType: 'struct VaultParameters',
        name: 'params',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'interestAccumulator',
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
    name: 'interestRate',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
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
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'isApprovedOrOwner',
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
    name: 'isWhitelisted',
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
    name: 'lastInterestAccumulatorUpdated',
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
        internalType: 'uint256[]',
        name: 'vaultIDs',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'who',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'liquidate',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stablecoinAmountToReceive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'collateralAmountToGive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'badDebtFromLiquidation',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'oracleValue',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'newInterestAccumulator',
            type: 'uint256',
          },
        ],
        internalType: 'struct LiquidatorData',
        name: 'liqData',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'vaultIDs',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'liquidate',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stablecoinAmountToReceive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'collateralAmountToGive',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'badDebtFromLiquidation',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'oracleValue',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'newInterestAccumulator',
            type: 'uint256',
          },
        ],
        internalType: 'struct LiquidatorData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'liquidationSurcharge',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxLiquidationDiscount',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
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
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'nonces',
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
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
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
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'repayFee',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
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
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
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
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'baseURI_',
        type: 'string',
      },
    ],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_debtCeiling',
        type: 'uint256',
      },
    ],
    name: 'setDebtCeiling',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_veBoostProxy',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'xBoost',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'yBoost',
        type: 'uint256[]',
      },
    ],
    name: 'setLiquidationBoostParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oracle',
        type: 'address',
      },
    ],
    name: 'setOracle',
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
    name: 'setTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'param',
        type: 'uint64',
      },
      {
        internalType: 'bytes32',
        name: 'what',
        type: 'bytes32',
      },
    ],
    name: 'setUint64',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stablecoin',
    outputs: [
      {
        internalType: 'contract IAgToken',
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
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
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
    inputs: [],
    name: 'surplus',
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
    name: 'targetHealthFactor',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'togglePause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'toggleWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
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
    name: 'totalNormalizedDebt',
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
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'vaultID',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [
      {
        internalType: 'contract ITreasury',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'vaultData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'collateralAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'normalizedDebt',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vaultIDCount',
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
    name: 'veBoostProxy',
    outputs: [
      {
        internalType: 'contract IVeBoostProxy',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'whitelistingActivated',
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
    name: 'xLiquidationBoost',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'yLiquidationBoost',
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
] as const;

export type AngleVaultManager = typeof angleVaultManagerAbi;
export type AngleVaultManagerContract = GetContractReturnType<AngleVaultManager, PublicClient>;

export class AngleVaultManager__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: angleVaultManagerAbi, publicClient: client });
  }
}