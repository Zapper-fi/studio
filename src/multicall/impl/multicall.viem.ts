import { Abi } from 'abitype';
import DataLoader from 'dataloader';
import {
  GetContractReturnType,
  Hex,
  PublicClient,
  ReadContractReturnType,
  decodeFunctionResult,
  encodeFunctionData,
  getAbiItem,
  getFunctionSignature,
} from 'viem';

import { MulticallContract } from '~contract/contracts/viem/Multicall';
import { MulticallWrappedReadRequestError } from '~multicall/errors/multicall.request.error';
import { DEFAULT_DATALOADER_OPTIONS } from '~multicall/multicall.constants';

import { MulticallWrappedReadDecodeError } from '../errors/multicall.decode.error';

declare module 'abitype' {
  export interface Config {
    AddressType: string;
    BytesType: {
      inputs: string;
      outputs: string;
    };
  }
}

export type ContractCall<T extends Abi = Abi, V extends string = string> = {
  abi: T;
  address: string;
  functionName: V;
  args: any[];
  stack?: string;
};

type CallStruct = {
  target: string;
  callData: string;
};

type MulticallCallbackHooks = {
  beforeCallHook?: (calls: ContractCall[], callRequests: CallStruct[]) => void;
  afterResultSerializer?: (result: ReadContractReturnType) => unknown;
};

export class ViemMulticallDataLoader {
  private multicall: MulticallContract;
  private dataLoader: DataLoader<ContractCall, ReadContractReturnType>;
  private beforeCallHook?: (calls: ContractCall[], callRequests: CallStruct[]) => void;
  private afterResultSerializer?: (result: ReadContractReturnType) => unknown;

  constructor(
    multicall: MulticallContract,
    dataLoaderOptions: DataLoader.Options<ContractCall, ReadContractReturnType> = DEFAULT_DATALOADER_OPTIONS,
    { beforeCallHook, afterResultSerializer }: MulticallCallbackHooks = {} as MulticallCallbackHooks,
  ) {
    this.multicall = multicall;
    this.dataLoader = new DataLoader(this.doCalls.bind(this), dataLoaderOptions);
    this.beforeCallHook = beforeCallHook;
    this.afterResultSerializer = afterResultSerializer;
  }

  get contract(): MulticallContract {
    return this.multicall;
  }

  async doCalls(calls: ContractCall[]): Promise<ReadContractReturnType[]> {
    const callRequests = calls.map(call => ({
      target: call.address,
      callData: encodeFunctionData({
        abi: call.abi,
        args: call.args,
        functionName: call.functionName,
      }),
    }));

    if (this.beforeCallHook) this.beforeCallHook(calls, callRequests);
    const {
      result: [success, data],
    } = await this.multicall.simulate.aggregate([callRequests, false]);

    if (data.length !== callRequests.length) {
      throw new Error(`Unexpected response length: received ${data.length}; expected ${callRequests.length}`);
    }

    const result: (ReadContractReturnType | Error)[] = calls.map(({ abi, functionName, args, address, stack }, i) => {
      const abiItem = getAbiItem({ abi, name: functionName });
      if (abiItem.type !== 'function') throw new Error(`unexpected abi item type: ${abiItem.type}`);
      const signature = getFunctionSignature(abiItem);

      const { success, data } = res[1][i];
      if (!success) return new MulticallWrappedReadRequestError({ address, signature, args, stack });

      try {
        const result = decodeFunctionResult({ abi, functionName, args, data: data as Hex });
        if (this.afterResultSerializer) return this.afterResultSerializer(result);
        return result;
      } catch (err) {
        return new MulticallWrappedReadDecodeError({ address, signature, args, stack });
      }
    });

    return result;
  }

  public async load(call: ContractCall): Promise<ReadContractReturnType> {
    return this.dataLoader.load(call);
  }

  public wrap<T extends Abi>(contract: GetContractReturnType<T, PublicClient>): GetContractReturnType<T, PublicClient> {
    const { address, abi } = contract;
    const stack = new Error().stack?.split('\n').slice(1).join('\n');

    const readProxy = new Proxy(contract, {
      get: (target, functionName: string) => {
        return (args: any[]) => this.load({ abi, address, functionName, args, stack });
      },
    });

    return { ...contract, read: readProxy } as GetContractReturnType<T, PublicClient>;
  }
}
