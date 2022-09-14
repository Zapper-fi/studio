import DataLoader from 'dataloader';
import { Contract } from 'ethers';
import { FunctionFragment, Interface } from 'ethers/lib/utils';

import { Multicall } from '~contract/contracts';

import { MulticallContract } from './multicall.contract';
import { IMulticallWrapper } from './multicall.interface';

export type ContractCall = {
  fragment: FunctionFragment;
  address: string;
  params: any[];
  stack?: string;
};

type TargetContract = Pick<Contract, 'functions' | 'interface' | 'callStatic' | 'address'>;

export const isMulticallUnderlyingError = (err: Error) => err.message.includes('Multicall call failed for');

export type MulticallCallbackHooks = {
  beforeCallHook?: (calls: ContractCall[], callRequests: Multicall.CallStruct[]) => void;
};

const DEFAULT_DATALOADER_OPTIONS = { cache: false, maxBatchSize: 250 };

export class EthersMulticall implements IMulticallWrapper {
  private multicall: Multicall;
  private dataLoader: DataLoader<ContractCall, any>;
  private beforeCallHook?: (calls: ContractCall[], callRequests: Multicall.CallStruct[]) => void;

  constructor(
    multicall: Multicall,
    dataLoaderOptions: DataLoader.Options<ContractCall, any> = DEFAULT_DATALOADER_OPTIONS,
    { beforeCallHook }: MulticallCallbackHooks = {},
  ) {
    this.multicall = multicall;
    this.dataLoader = new DataLoader(this.doCalls.bind(this), dataLoaderOptions);
    this.beforeCallHook = beforeCallHook;
  }

  get contract() {
    return this.multicall;
  }

  private async doCalls(calls: ContractCall[]) {
    const callRequests = calls.map(call => ({
      target: call.address,
      callData: new Interface([]).encodeFunctionData(call.fragment, call.params),
    }));

    if (this.beforeCallHook) this.beforeCallHook(calls, callRequests);
    const res = await this.multicall.callStatic.aggregate(callRequests, false);

    if (res.returnData.length !== callRequests.length) {
      throw new Error(`Unexpected response length: received ${res.returnData.length}; expected ${callRequests.length}`);
    }

    const result = calls.map((call, i) => {
      const signature = FunctionFragment.from(call.fragment).format();
      const callIdentifier = [call.address, signature].join(':');
      const [success, data] = res.returnData[i];

      if (!success) {
        const error = new Error(`Multicall call failed for ${callIdentifier}`);
        error.stack = call.stack;
        return error;
      }

      try {
        const outputs = call.fragment.outputs!;
        const result = new Interface([]).decodeFunctionResult(call.fragment, data);
        return outputs.length === 1 ? result[0] : result;
      } catch (err) {
        const error = new Error(`Multicall call failed for ${callIdentifier}: ${err.message} (decode)`);
        error.stack = call.stack;
        return error;
      }
    });

    return result;
  }

  wrap<T extends TargetContract>(contract: T) {
    const abi = contract.interface.fragments;
    const stack = new Error().stack?.split('\n').slice(1).join('\n');
    const multicallContract = new MulticallContract(contract.address, abi as any, stack);

    const funcs = abi.reduce((memo, frag) => {
      if (frag.type !== 'function') return memo;

      const funcFrag = frag as FunctionFragment;
      if (!['pure', 'view'].includes(funcFrag.stateMutability)) return memo;

      // Overwrite the function with a dataloader batched call
      const multicallFunc = multicallContract[funcFrag.name].bind(multicallContract);
      const newFunc = (...args: any) => {
        const contractCall = multicallFunc(...args);
        return this.dataLoader.load(contractCall);
      };

      memo[funcFrag.name] = newFunc;
      return memo;
    }, {} as Record<string, (...args: any) => any>);

    return Object.setPrototypeOf({ ...contract, ...funcs }, Contract.prototype) as any as T;
  }
}

export default EthersMulticall;
