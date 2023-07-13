import { Fragment, FunctionFragment, JsonFragment } from '@ethersproject/abi';

import { ContractCall } from './multicall.interface';

export class MulticallContract {
  private _address: string;
  private _abi: Fragment[];
  private _stack?: string;
  private _functions: FunctionFragment[];

  get address() {
    return this._address;
  }

  get abi() {
    return this._abi;
  }

  get stack() {
    return this._stack;
  }

  get functions() {
    return this._functions;
  }

  constructor(address: string, abi: JsonFragment[] | string[] | Fragment[], stack?: string) {
    this._address = address;
    this._stack = stack;

    this._abi = abi.map((item: JsonFragment | string | Fragment) => Fragment.from(item));
    this._functions = this._abi.filter(x => x.type === 'function').map(x => FunctionFragment.from(x));
    const fragments = this._functions.filter(x => x.stateMutability === 'pure' || x.stateMutability === 'view');

    for (const frag of fragments) {
      const fn = (...params: any[]): ContractCall => ({ fragment: frag, address, params, stack });
      if (!this[frag.name]) Object.defineProperty(this, frag.name, { enumerable: true, writable: false, value: fn });
    }
  }

  [method: string]: any;
}
