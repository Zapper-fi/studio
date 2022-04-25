import { Inject, Injectable } from '@nestjs/common';
import { range } from 'lodash';

import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { CurveContractFactory } from '../contracts';

@Injectable()
export class CurveFactoryPoolDefinitionStrategy {
  constructor(@Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory) {}

  build({ address }: { address: string }) {
    return async ({ network, multicall }: { network: Network; multicall: Multicall }) => {
      const factoryContract = this.curveContractFactory.curveFactory({ address, network }); // Supports V1 and V2 factory
      const numPoolsRaw = await factoryContract.pool_count();
      const numPools = Number(numPoolsRaw);

      const definitions = await Promise.all(
        range(0, numPools).map(async i => {
          const addressRaw = await multicall.wrap(factoryContract).pool_list(i);
          const address = addressRaw.toLowerCase();
          return { swapAddress: address, tokenAddress: address };
        }),
      );

      return definitions;
    };
  }
}
