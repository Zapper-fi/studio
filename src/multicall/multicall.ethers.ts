import { FunctionFragment } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';

import { Multicall as MulticallContract } from '~contract/contracts';

export type EthersMulticallConfig = {
  batchInterval?: number;
  batchMaxSize?: number;
};

type MulticallAggregateReturnData = Awaited<ReturnType<MulticallContract['callStatic']['aggregate']>>['returnData'];
type TargetContract = Pick<Contract, 'functions' | 'interface' | 'callStatic' | 'address'>;
type HasContractFunctions = { functions: Record<string, unknown> };

// Extracts the contract functions in `functions`
type AllContractFunctions<T extends HasContractFunctions> = keyof {
  [P in keyof T['functions']]: T[P];
};

// Extracts all methods from type
type Methods<T> = { [P in keyof T as T[P] extends (...args: any[]) => any ? P : never]: T[P] };

// Picks only the methods on the contract that are defined in `functions`
type ExtractContractFunctions<T extends HasContractFunctions> = Pick<Methods<T>, AllContractFunctions<T>>;

type BatchItem = {
  callData: string;
  callTarget: string;
  functionFragment: FunctionFragment;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
};

export class EthersMulticall {
  private readonly batchInterval: number;
  private readonly batchMaxSize: number;
  private readonly multicallContract: MulticallContract;
  private batchRequests: BatchItem[] | null;

  constructor(multicallContact: MulticallContract, opts: EthersMulticallConfig = {}) {
    const { batchInterval = 10, batchMaxSize = 250 } = opts;

    this.multicallContract = multicallContact;
    this.batchInterval = batchInterval;
    this.batchMaxSize = batchMaxSize;
    this.batchRequests = null;
  }

  get contract() {
    return this.multicallContract;
  }

  /**
   * Intercepts provider calls to functions / static functions on the contract,
   * replaces execution with encoding the function data of the target & args, then
   * adds the function data to the multicall consumption queue
   */
  private hijackExecution(contract: TargetContract, method: string) {
    return (...args: any[]) => {
      const functionFragment = contract.interface.getFunction(method as string);
      if (!functionFragment) throw new Error('Cannot find function on the given contract');

      if (!this.batchRequests) {
        this.batchRequests = [];
      }

      return new Promise((resolve, reject) => {
        this.batchRequests?.push({
          functionFragment,
          callData: contract.interface.encodeFunctionData(functionFragment, args),
          callTarget: contract.address,
          resolve,
          reject,
        });

        if (this.batchRequests?.length === 1) {
          this.scheduleConsumeQueue();
        }

        if (this.batchRequests?.length === this.batchMaxSize) {
          this.consumeQueue();
        }
      });
    };
  }

  wrap<T extends TargetContract>(contract: T): ExtractContractFunctions<T> & Pick<T, 'callStatic'> {
    // Removes readonly contraints on the contract properties
    const configurableContract = Object.create(contract);

    return new Proxy(configurableContract, {
      get: (target, key) => {
        const functionName = key as string;
        const isFunctionCall = functionName in configurableContract.functions;
        const isStaticFunctionCall = functionName === 'callStatic';
        // Disregard calls other than provider method invocations
        if (!isFunctionCall && !isStaticFunctionCall) throw new Error('Invalid multicall operation');

        if (isStaticFunctionCall) {
          // Removes readonly contraints on the `functions` / `callStatic` properties
          const configurableTarget = Object.create(target[functionName]);

          return new Proxy(configurableTarget, {
            get: (_target, staticFunctionName) => this.hijackExecution(contract, staticFunctionName as string),
          });
        }

        return this.hijackExecution(contract, functionName);
      },
    });
  }

  private async aggregate(batchItems: BatchItem[]) {
    // Prepare batch items into payloads
    const calls = batchItems.map(({ callData, callTarget }) => {
      return {
        target: callTarget,
        callData,
      };
    });

    // Actual call to multicall's aggregate
    try {
      const responses = await this.multicallContract.callStatic.aggregate(calls, false);
      const returnData = responses.returnData;

      if (returnData.length !== batchItems.length) {
        throw new Error(`Unexpected response length: received ${returnData.length}; expected ${batchItems.length}`);
      }

      return returnData;
    } catch (err) {
      const exception = err as Error;
      exception.message = `Multicall aggregate request failed: ${exception.message}`;
      throw err;
    }
  }

  private decodeFunctionData(batchItem: BatchItem, batchReturnData: MulticallAggregateReturnData[number]) {
    const { callTarget, functionFragment } = batchItem;
    const [success, data] = batchReturnData;
    const functionSignature = functionFragment.format();

    // Multicall's response for the batch item failed
    if (!success) {
      const callIdentifier = [callTarget, functionSignature].join(':');
      throw new Error(`Multicall call failed for ${callIdentifier}`);
    }

    try {
      const decoder = ethers.utils.defaultAbiCoder;
      if (!functionFragment.outputs) throw new Error('no outputs received');
      const decoded = decoder.decode(functionFragment.outputs, data);
      if (functionFragment.outputs?.length > 1) return decoded;
      return decoded[0];
    } catch (err) {
      const exception = err as Error;
      const callIdentifier = [callTarget, functionSignature].join(':');
      exception.message = `Multicall call failed for ${callIdentifier}: ${exception.message}`;
      throw err;
    }
  }

  private async consumeQueue() {
    const batch = this.batchRequests;
    if (!batch) return;

    // Clear the batch queue
    this.batchRequests = null;

    // Call multicall's aggregate with all the batch requests
    let returnData: MulticallAggregateReturnData;
    try {
      returnData = await this.aggregate(batch);
    } catch (err) {
      // Each batch rejects with the error reason
      batch.forEach(({ reject }) => reject(err));
      return;
    }

    // Decode the data for each batch item
    batch.forEach((batchItem, i) => {
      const { resolve, reject } = batchItem;
      try {
        const decodedBatchData = this.decodeFunctionData(batchItem, returnData[i]);
        resolve(decodedBatchData);
      } catch (err) {
        reject(err);
      }
    });
  }

  private scheduleConsumeQueue(): void {
    setTimeout(async () => {
      if (this.batchRequests?.length) {
        try {
          await this.consumeQueue();
        } catch (err) {
          const exception = err as Error;
          exception.message = `Multicall unexpected error occurred: ${exception.message}`;
        }
      }
    }, this.batchInterval);
  }
}
