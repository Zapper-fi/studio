import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CurvePoolDefinition,
  CurvePoolStaticTokenFetcher,
  ResolvePoolCoinAddressParams,
  ResolvePoolReserveParams,
} from '~apps/curve/common/curve.pool-static.token-fetcher';

import { SaddleViemContractFactory } from '../contracts';
import { SaddleSwap } from '../contracts/viem';
import { SaddleSwapContract } from '../contracts/viem/SaddleSwap';

import { SADDLE_POOL_DEFINITIONS } from './saddle.pool.definitions';

@PositionTemplate()
export class EthereumSaddlePoolTokenFetcher extends CurvePoolStaticTokenFetcher<SaddleSwap> {
  groupLabel = 'Pools';
  poolDefinitions = SADDLE_POOL_DEFINITIONS;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SaddleViemContractFactory) protected readonly contractFactory: SaddleViemContractFactory,
  ) {
    super(appToolkit);
  }

  resolvePoolContract(definition: CurvePoolDefinition): SaddleSwapContract {
    return this.contractFactory.saddleSwap({ address: definition.swapAddress, network: this.network });
  }

  async resolvePoolCoinAddress({ contract, index }: ResolvePoolCoinAddressParams<SaddleSwap>) {
    return contract.read.getToken([index]);
  }

  async resolvePoolReserve({ contract, index }: ResolvePoolReserveParams<SaddleSwap>) {
    return contract.read.getTokenBalance([index]);
  }

  async resolvePoolFee() {
    return BigNumber.from('4000000');
  }
}
