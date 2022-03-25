import { Inject, Injectable } from '@nestjs/common';

import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { EthersMulticall, MulticallConfig } from './multicall.ethers';
import { MULTICALL_ADDRESSES } from './multicall.registry';

@Injectable()
export class MulticallService {
  constructor(
    @Inject(ContractFactory)
    private readonly contractFactory: ContractFactory,
  ) {}

  getMulticall(network: Network, opts?: MulticallConfig) {
    const multicallAddress = MULTICALL_ADDRESSES[network];
    if (!multicallAddress) throw new Error(`Multicall not supported on network "${network}"`);

    const contract = this.contractFactory.multicall({
      network,
      address: multicallAddress,
    });

    return new EthersMulticall(contract, opts);
  }
}
