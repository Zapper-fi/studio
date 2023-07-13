import { FunctionFragment } from '@ethersproject/abi';
import { Contract, ethers } from 'ethers';

import { Multicall } from '~contract/contracts';

export type ContractCall = {
  fragment: FunctionFragment;
  address: string;
  params: any[];
  stack?: string;
};

export type TargetContract = Pick<Contract, 'functions' | 'interface' | 'callStatic' | 'address'>;

export interface IMulticallWrapper {
  get contract(): Multicall;
  load(call: ContractCall): Promise<ethers.utils.Result>;
  wrap<T extends TargetContract>(contract: T): T;
}
