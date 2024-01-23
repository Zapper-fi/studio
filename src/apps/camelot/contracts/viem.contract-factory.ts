import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  CamelotDividend__factory,
  CamelotFactory__factory,
  CamelotMaster__factory,
  CamelotNftPool__factory,
  CamelotNitroFactory__factory,
  CamelotNitroPool__factory,
  CamelotPair__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class CamelotViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  camelotDividend({ address, network }: ContractOpts) {
    return CamelotDividend__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  camelotFactory({ address, network }: ContractOpts) {
    return CamelotFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  camelotMaster({ address, network }: ContractOpts) {
    return CamelotMaster__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  camelotNftPool({ address, network }: ContractOpts) {
    return CamelotNftPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  camelotNitroFactory({ address, network }: ContractOpts) {
    return CamelotNitroFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  camelotNitroPool({ address, network }: ContractOpts) {
    return CamelotNitroPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  camelotPair({ address, network }: ContractOpts) {
    return CamelotPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
