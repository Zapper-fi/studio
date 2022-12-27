/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { CreditManagerV2, CreditManagerV2Interface } from '../CreditManagerV2';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AdaptersOrCreditFacadeOnlyException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AllowanceFailedException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CallerNotPausableAdminException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CallerNotUnPausableAdminException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CreditConfiguratorOnlyException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CreditFacadeOnlyException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HasNoOpenedAccountException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotEnoughCollateralException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyLockException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TargetContractNotAllowedException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokenAlreadyAddedException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokenNotAllowedException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TooManyEnabledTokensException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TooManyTokensException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddressException',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddressOrUserAlreadyHasAccountException',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'ExecuteOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newConfigurator',
        type: 'address',
      },
    ],
    name: 'NewConfigurator',
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
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: '_accountFactory',
    outputs: [
      {
        internalType: 'contract IAccountFactory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_acl',
    outputs: [
      {
        internalType: 'contract IACL',
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
    name: 'adapterToContract',
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
        name: 'payer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'creditAccount',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'addCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'liquidator',
        type: 'address',
      },
    ],
    name: 'addEmergencyLiquidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'addToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'targetContract',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approveCreditAccount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'totalValue',
        type: 'uint256',
      },
      {
        internalType: 'enum ClosureAction',
        name: 'closureActionType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'borrowedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowedAmountWithInterest',
        type: 'uint256',
      },
    ],
    name: 'calcClosePayments',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountToPool',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'remainingFunds',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loss',
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
        name: 'creditAccount',
        type: 'address',
      },
    ],
    name: 'calcCreditAccountAccruedInterest',
    outputs: [
      {
        internalType: 'uint256',
        name: 'borrowedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowedAmountWithInterest',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowedAmountWithInterestAndFees',
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
    name: 'canLiquidateWhilePaused',
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
        name: 'adapter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'targetContract',
        type: 'address',
      },
    ],
    name: 'changeContractAllowance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creditAccount',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'checkAndEnableToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creditAccount',
        type: 'address',
      },
    ],
    name: 'checkAndOptimizeEnabledTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'state',
        type: 'bool',
      },
    ],
    name: 'checkEmergencyPausable',
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
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'enum ClosureAction',
        name: 'closureActionType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'totalValue',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'skipTokenMask',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'convertWETH',
        type: 'bool',
      },
    ],
    name: 'closeCreditAccount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'remainingFunds',
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
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'collateralTokens',
    outputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'liquidationThreshold',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenMask',
        type: 'uint256',
      },
    ],
    name: 'collateralTokensByMask',
    outputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'liquidationThreshold',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collateralTokensCount',
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
    name: 'contractToAdapter',
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
    name: 'creditAccounts',
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
    name: 'creditConfigurator',
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
    name: 'creditFacade',
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
    name: 'cumulativeDropAtFastCheckRAY',
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
        name: 'creditAccount',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'disableToken',
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
    inputs: [],
    name: 'emergencyLiquidation',
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
    name: 'enabledTokensMap',
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
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'targetContract',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'executeOrder',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creditAccount',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balanceInBefore',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'balanceOutBefore',
        type: 'uint256',
      },
    ],
    name: 'fastCollateralCheck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fees',
    outputs: [
      {
        internalType: 'uint16',
        name: 'feeInterest',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'feeLiquidation',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'liquidationDiscount',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'feeLiquidationExpired',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'liquidationDiscountExpired',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'forbiddenTokenMask',
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
        name: 'creditAccount',
        type: 'address',
      },
    ],
    name: 'fullCollateralCheck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'getCreditAccountOrRevert',
    outputs: [
      {
        internalType: 'address',
        name: 'result',
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'liquidationThresholds',
    outputs: [
      {
        internalType: 'uint16',
        name: 'lt',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creditAccount',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'increase',
        type: 'bool',
      },
    ],
    name: 'manageDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: 'newBorrowedAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxAllowedEnabledTokenLength',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'borrowedAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address',
      },
    ],
    name: 'openCreditAccount',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'pool',
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
    name: 'poolService',
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
    name: 'priceOracle',
    outputs: [
      {
        internalType: 'contract IPriceOracleV2',
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
        name: 'liquidator',
        type: 'address',
      },
    ],
    name: 'removeEmergencyLiquidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_creditConfigurator',
        type: 'address',
      },
    ],
    name: 'setConfigurator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_forbidMask',
        type: 'uint256',
      },
    ],
    name: 'setForbidMask',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'uint16',
        name: 'liquidationThreshold',
        type: 'uint16',
      },
    ],
    name: 'setLiquidationThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'newMaxEnabledTokens',
        type: 'uint8',
      },
    ],
    name: 'setMaxEnabledTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_feeInterest',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_feeLiquidation',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_liquidationDiscount',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_feeLiquidationExpired',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_liquidationDiscountExpired',
        type: 'uint16',
      },
    ],
    name: 'setParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'tokenMasksMap',
    outputs: [
      {
        internalType: 'uint256',
        name: 'mask',
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
    ],
    name: 'transferAccountOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'underlying',
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
    name: 'universalAdapter',
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
        internalType: 'address',
        name: '_creditFacade',
        type: 'address',
      },
    ],
    name: 'upgradeCreditFacade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_priceOracle',
        type: 'address',
      },
    ],
    name: 'upgradePriceOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
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
    name: 'wethAddress',
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
    name: 'wethGateway',
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

export class CreditManagerV2__factory {
  static readonly abi = _abi;
  static createInterface(): CreditManagerV2Interface {
    return new utils.Interface(_abi) as CreditManagerV2Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): CreditManagerV2 {
    return new Contract(address, _abi, signerOrProvider) as CreditManagerV2;
  }
}
