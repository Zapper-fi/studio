import { Contract } from 'ethers';

import { Multicall } from '~contract/contracts';

type TargetContract = Pick<Contract, 'functions' | 'interface' | 'callStatic' | 'address'>;

export interface IMulticallWrapper {
  get contract(): Multicall;
  wrap<T extends TargetContract>(contract: T): T;
}
