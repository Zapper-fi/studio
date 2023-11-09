import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PlatypusFinanceMasterPlatypusV1__factory,
  PlatypusFinanceMasterPlatypusV2__factory,
  PlatypusFinancePool__factory,
  PlatypusFinancePoolToken__factory,
  PlatypusFinanceVotingEscrow__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PlatypusFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  platypusFinanceMasterPlatypusV1({ address, network }: ContractOpts) {
    return PlatypusFinanceMasterPlatypusV1__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  platypusFinanceMasterPlatypusV2({ address, network }: ContractOpts) {
    return PlatypusFinanceMasterPlatypusV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  platypusFinancePool({ address, network }: ContractOpts) {
    return PlatypusFinancePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  platypusFinancePoolToken({ address, network }: ContractOpts) {
    return PlatypusFinancePoolToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  platypusFinanceVotingEscrow({ address, network }: ContractOpts) {
    return PlatypusFinanceVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
