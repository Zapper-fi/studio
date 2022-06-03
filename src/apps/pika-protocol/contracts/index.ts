import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { EthersMulticall } from '~multicall';
import { Network } from '~types/network.interface';

import { PikaProtocolVault, PikaProtocolVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PikaProtocolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pikaProtocolVault({ address, network }: ContractOpts) {
    return PikaProtocolVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }

  // Defines helper function since Contract lacks method for returning its current balance
  async vaultBalance(vaultContractAddress: string, tokenAddress: string, network: Network, multicall: EthersMulticall) {
    return await Promise.all([multicall.wrap(this.appToolkit.globalContracts.erc20({ network, address: tokenAddress })).balanceOf(vaultContractAddress)
    ]);
  }

}



export type { PikaProtocolVault } from './ethers';
