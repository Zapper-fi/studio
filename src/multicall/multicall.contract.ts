import { Fragment, FunctionFragment, JsonFragment } from '@ethersproject/abi';

import { ContractCall } from './multicall.ethers';

export class MulticallContract {
  private _address: string;
  private _abi: Fragment[];
  private _functions: FunctionFragment[];

  get address() {
    return this._address;
  }

  get abi() {
    return this._abi;
  }

  get functions() {
    return this._functions;
  }

  constructor(address: string, abi: JsonFragment[] | string[] | Fragment[]) {
    this._address = address;

    this._abi = abi.map((item: JsonFragment | string | Fragment) => Fragment.from(item));
    this._functions = this._abi.filter(x => x.type === 'function').map(x => FunctionFragment.from(x));
    const callFunctions = this._functions.filter(x => x.stateMutability === 'pure' || x.stateMutability === 'view');

    for (const callFunction of callFunctions) {
      const { name } = callFunction;
      const getCall = makeCallFunction(this, name);
      if (!this[name]) defineReadOnly(this, name, getCall);
    }
  }

  [method: string]: any;
}

function makeCallFunction(contract: MulticallContract, name: string) {
  return (...params: any[]): ContractCall => {
    const { address } = contract;
    const fragment = contract.functions.find(f => f.name === name)!;
    return { fragment, address, params };
  };
}

function defineReadOnly(object: object, name: string, value: unknown) {
  Object.defineProperty(object, name, {
    enumerable: true,
    writable: false,
    value,
  });
}
