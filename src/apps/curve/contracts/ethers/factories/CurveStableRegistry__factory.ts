/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { CurveStableRegistry, CurveStableRegistryInterface } from '../CurveStableRegistry';

const _abi = [
  {
    name: 'PoolAdded',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rate_method_id',
        type: 'bytes',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'PoolRemoved',
    inputs: [
      {
        name: 'pool',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: '_address_provider',
        type: 'address',
      },
      {
        name: '_gauge_controller',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'find_pool_for_coins',
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'find_pool_for_coins',
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: 'i',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_n_coins',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[2]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_coins',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_underlying_coins',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_decimals',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_underlying_decimals',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_rates',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_gauges',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[10]',
      },
      {
        name: '',
        type: 'int128[10]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_balances',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_underlying_balances',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_virtual_price_from_lp_token',
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_A',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_parameters',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'A',
        type: 'uint256',
      },
      {
        name: 'future_A',
        type: 'uint256',
      },
      {
        name: 'fee',
        type: 'uint256',
      },
      {
        name: 'admin_fee',
        type: 'uint256',
      },
      {
        name: 'future_fee',
        type: 'uint256',
      },
      {
        name: 'future_admin_fee',
        type: 'uint256',
      },
      {
        name: 'future_owner',
        type: 'address',
      },
      {
        name: 'initial_A',
        type: 'uint256',
      },
      {
        name: 'initial_A_time',
        type: 'uint256',
      },
      {
        name: 'future_A_time',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_fees',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[2]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_admin_balances',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[8]',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_coin_indices',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'int128',
      },
      {
        name: '',
        type: 'int128',
      },
      {
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'estimate_gas_used',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'is_meta',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_pool_name',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_coin_swap_count',
    inputs: [
      {
        name: '_coin',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_coin_swap_complement',
    inputs: [
      {
        name: '_coin',
        type: 'address',
      },
      {
        name: '_index',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_pool_asset_type',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'add_pool',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_n_coins',
        type: 'uint256',
      },
      {
        name: '_lp_token',
        type: 'address',
      },
      {
        name: '_rate_info',
        type: 'bytes32',
      },
      {
        name: '_decimals',
        type: 'uint256',
      },
      {
        name: '_underlying_decimals',
        type: 'uint256',
      },
      {
        name: '_has_initial_A',
        type: 'bool',
      },
      {
        name: '_is_v1',
        type: 'bool',
      },
      {
        name: '_name',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'add_pool_without_underlying',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_n_coins',
        type: 'uint256',
      },
      {
        name: '_lp_token',
        type: 'address',
      },
      {
        name: '_rate_info',
        type: 'bytes32',
      },
      {
        name: '_decimals',
        type: 'uint256',
      },
      {
        name: '_use_rates',
        type: 'uint256',
      },
      {
        name: '_has_initial_A',
        type: 'bool',
      },
      {
        name: '_is_v1',
        type: 'bool',
      },
      {
        name: '_name',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'add_metapool',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_n_coins',
        type: 'uint256',
      },
      {
        name: '_lp_token',
        type: 'address',
      },
      {
        name: '_decimals',
        type: 'uint256',
      },
      {
        name: '_name',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'add_metapool',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_n_coins',
        type: 'uint256',
      },
      {
        name: '_lp_token',
        type: 'address',
      },
      {
        name: '_decimals',
        type: 'uint256',
      },
      {
        name: '_name',
        type: 'string',
      },
      {
        name: '_base_pool',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_pool',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_pool_gas_estimates',
    inputs: [
      {
        name: '_addr',
        type: 'address[5]',
      },
      {
        name: '_amount',
        type: 'uint256[2][5]',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_coin_gas_estimates',
    inputs: [
      {
        name: '_addr',
        type: 'address[10]',
      },
      {
        name: '_amount',
        type: 'uint256[10]',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_gas_estimate_contract',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_estimator',
        type: 'address',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_liquidity_gauges',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_liquidity_gauges',
        type: 'address[10]',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_pool_asset_type',
    inputs: [
      {
        name: '_pool',
        type: 'address',
      },
      {
        name: '_asset_type',
        type: 'uint256',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'batch_set_pool_asset_type',
    inputs: [
      {
        name: '_pools',
        type: 'address[32]',
      },
      {
        name: '_asset_types',
        type: 'uint256[32]',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'address_provider',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'gauge_controller',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'pool_list',
    inputs: [
      {
        name: 'arg0',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'pool_count',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'coin_count',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_coin',
    inputs: [
      {
        name: 'arg0',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_pool_from_lp_token',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_lp_token',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_updated',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
];

export class CurveStableRegistry__factory {
  static readonly abi = _abi;
  static createInterface(): CurveStableRegistryInterface {
    return new utils.Interface(_abi) as CurveStableRegistryInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): CurveStableRegistry {
    return new Contract(address, _abi, signerOrProvider) as CurveStableRegistry;
  }
}
