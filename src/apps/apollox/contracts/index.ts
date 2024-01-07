import { Injectable, Inject } from '@nestjs/common';
import { utils } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Alp, Alp__factory, AlpProxy__factory, AlpStaking__factory, Apx__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ApolloxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  alp({ address, network }: ContractOpts) {
    const contr: Alp = Alp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
    const a = contr.balanceOf('0xe4dab34c2a3cb145bbe419748cdf57072f5db8f0');
    void a.then(value => {
      console.log(utils.formatUnits(value, 18));
      // Expected output: "Success!"
    });
    return Alp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  alpProxy({ address, network }: ContractOpts) {
    return AlpProxy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  alpStaking({ address, network }: ContractOpts) {
    return AlpStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  apx({ address, network }: ContractOpts) {
    return Apx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Alp } from './ethers';
export type { AlpProxy } from './ethers';
export type { AlpStaking } from './ethers';
export type { Apx } from './ethers';
