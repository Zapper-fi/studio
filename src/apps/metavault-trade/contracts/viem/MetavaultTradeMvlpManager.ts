/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { getContract, GetContractReturnType, PublicClient } from 'viem';

export const metavaultTradeMvlpManagerAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_usdm',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_mvlp',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_cooldownDuration',
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
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
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
        internalType: 'uint256',
        name: 'aumInUsdm',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mvlpSupply',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdmAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mintAmount',
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
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mvlpAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'aumInUsdm',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mvlpSupply',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdmAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'RemoveLiquidity',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_COOLDOWN_DURATION',
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
    name: 'PRICE_PRECISION',
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
    name: 'USDM_DECIMALS',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minUsdm',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minMvlp',
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
        name: '_fundingAccount',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minUsdm',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minMvlp',
        type: 'uint256',
      },
    ],
    name: 'addLiquidityForAccount',
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
    name: 'aumAddition',
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
    name: 'aumDeduction',
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
    name: 'cooldownDuration',
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
        internalType: 'bool',
        name: 'maximise',
        type: 'bool',
      },
    ],
    name: 'getAum',
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
        internalType: 'bool',
        name: 'maximise',
        type: 'bool',
      },
    ],
    name: 'getAumInUsdm',
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
    name: 'getAums',
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
    inputs: [],
    name: 'gov',
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
    name: 'inPrivateMode',
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
    name: 'isHandler',
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
    name: 'lastAddedAt',
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
    name: 'mvlp',
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
        name: '_tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_mvlpAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minOut',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
    ],
    name: 'removeLiquidity',
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
        name: '_account',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_mvlpAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minOut',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
    ],
    name: 'removeLiquidityForAccount',
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
        name: '_aumAddition',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_aumDeduction',
        type: 'uint256',
      },
    ],
    name: 'setAumAdjustment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_cooldownDuration',
        type: 'uint256',
      },
    ],
    name: 'setCooldownDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_gov',
        type: 'address',
      },
    ],
    name: 'setGov',
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
      {
        internalType: 'bool',
        name: '_isActive',
        type: 'bool',
      },
    ],
    name: 'setHandler',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_inPrivateMode',
        type: 'bool',
      },
    ],
    name: 'setInPrivateMode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdm',
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
    name: 'vault',
    outputs: [
      {
        internalType: 'contract IVault',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export type MetavaultTradeMvlpManager = typeof metavaultTradeMvlpManagerAbi;
export type MetavaultTradeMvlpManagerContract = GetContractReturnType<MetavaultTradeMvlpManager, PublicClient>;

export class MetavaultTradeMvlpManager__factory {
  static connect(address: string, client: PublicClient) {
    return getContract({ address, abi: metavaultTradeMvlpManagerAbi, publicClient: client });
  }
}
