import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { YieldProtocolCauldron__factory } from './ethers';
import { YieldProtocolLadle__factory } from './ethers';
import { YieldProtocolLendToken__factory } from './ethers';
import { YieldProtocolPool__factory } from './ethers';
import { YieldProtocolPoolToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class YieldProtocolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  yieldProtocolCauldron({ address, network }: ContractOpts) {
    return YieldProtocolCauldron__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yieldProtocolLadle({ address, network }: ContractOpts) {
    return YieldProtocolLadle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yieldProtocolLendToken({ address, network }: ContractOpts) {
    return YieldProtocolLendToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yieldProtocolPool({ address, network }: ContractOpts) {
    return YieldProtocolPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yieldProtocolPoolToken({ address, network }: ContractOpts) {
    return YieldProtocolPoolToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { YieldProtocolCauldron } from './ethers';
export type { YieldProtocolLadle } from './ethers';
export type { YieldProtocolLendToken } from './ethers';
export type { YieldProtocolPool } from './ethers';
export type { YieldProtocolPoolToken } from './ethers';
