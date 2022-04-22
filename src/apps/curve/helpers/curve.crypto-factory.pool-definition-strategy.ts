import { Inject, Injectable } from '@nestjs/common';
import { range } from 'lodash';

import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { CurveContractFactory } from '../contracts';

@Injectable()
export class CurveCryptoFactoryPoolDefinitionStrategy {
  constructor(@Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory) {}

  build({ address }: { address: string }) {
    return async ({ network, multicall }: { network: Network; multicall: Multicall }) => {
      const factoryContract = this.curveContractFactory.curveFactory({ address, network }); // Supports V1 and V2 factory
      const numPoolsRaw = await factoryContract.pool_count();
      const numPools = Number(numPoolsRaw);

      const definitions = await Promise.all(
        range(0, numPools).map(async i => {
          const swapAddressRaw = await multicall.wrap(factoryContract).pool_list(i);
          const swapAddress = swapAddressRaw.toLowerCase();
          const swapContract = this.curveContractFactory.curveCryptoPool({ address: swapAddress, network });
          const tokenAddressRaw = await multicall.wrap(swapContract).token();
          const tokenAddress = tokenAddressRaw.toLowerCase();

          return { swapAddress, tokenAddress };
        }),
      );

      return definitions;
    };
  }
}
