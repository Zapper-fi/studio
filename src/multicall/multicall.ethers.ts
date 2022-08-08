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

export class EthersMulticall implements IMulticallWrapper {
  private multicall: Multicall;
  private dataLoader: DataLoader<ContractCall, any>;
  private beforeCallHook?: (calls: ContractCall[]) => void;

  constructor(
    multicall: Multicall,
    dataLoaderOptions: DataLoader.Options<ContractCall, any> = { cache: false, maxBatchSize: 250 },
    beforeCallHook?: (calls: ContractCall[]) => void,
  ) {
    this.multicall = multicall;
    this.dataLoader = new DataLoader(this.doCalls.bind(this), dataLoaderOptions);
    this.beforeCallHook = beforeCallHook;
  }

  get contract() {
    return this.multicall;
  }

  private async doCalls(calls: readonly ContractCall[]) {
    const callRequests = calls.map(call => ({
      target: call.address,
      callData: new Interface([]).encodeFunctionData(call.fragment, call.params),
    }));

    if (this.beforeCallHook) this.beforeCallHook(calls);
    const response = await this.multicall.callStatic.aggregate(callRequests, false);

    const result = calls.map((call, i) => {
      const signature = FunctionFragment.from(call.fragment).format();
      const callIdentifier = [call.address, signature].join(':');
      const [success, data] = response.returnData[i];

      if (!success) {
        return new Error(`Multicall call failed for ${callIdentifier}\n${call.stack}`);
      }

      try {
        const outputs = call.fragment.outputs!;
        const result = new Interface([]).decodeFunctionResult(call.fragment, data);
        return outputs.length === 1 ? result[0] : result;
      } catch (err) {
        return new Error(`Multicall call failed for ${callIdentifier}\n${call.stack}`);
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
