import { Provider } from '@ethersproject/providers';
import { Injectable, Inject } from '@nestjs/common';
import { ethers } from 'ethers';

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

  pikaProtocolVaultRewards({ address, network }: ContractOpts) {
    const abi = [
      "function getClaimableReward(address account) external view returns(uint256)"
    ]

    const contract = new ethers.Contract(address, abi, this.appToolkit.getNetworkProvider(network))
    return contract;
  }

  // Defines helper function since Contract lacks method for returning its current balance
  async getVaultBalance(vaultContractAddress: string, depositTokenAddress: string, network: Network) {
    const multicall = this.appToolkit.getMulticall(network);
    return await Promise.all([multicall.wrap(this.appToolkit.globalContracts.erc20({ network, address: depositTokenAddress })).balanceOf(vaultContractAddress)
    ]);
  }


}



export type { PikaProtocolVault } from './ethers';
