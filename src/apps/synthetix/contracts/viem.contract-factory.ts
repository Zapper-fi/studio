import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  SynthetixAddressResolver__factory,
  SynthetixExchangeRates__factory,
  SynthetixFeePool__factory,
  SynthetixLoan__factory,
  SynthetixNetworkToken__factory,
  SynthetixPerp__factory,
  SynthetixRewards__factory,
  SynthetixSummaryUtil__factory,
  SynthetixSynthToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SynthetixViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  synthetixAddressResolver({ address, network }: ContractOpts) {
    return SynthetixAddressResolver__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixExchangeRates({ address, network }: ContractOpts) {
    return SynthetixExchangeRates__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixFeePool({ address, network }: ContractOpts) {
    return SynthetixFeePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixLoan({ address, network }: ContractOpts) {
    return SynthetixLoan__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixNetworkToken({ address, network }: ContractOpts) {
    return SynthetixNetworkToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixPerp({ address, network }: ContractOpts) {
    return SynthetixPerp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixRewards({ address, network }: ContractOpts) {
    return SynthetixRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixSummaryUtil({ address, network }: ContractOpts) {
    return SynthetixSummaryUtil__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  synthetixSynthToken({ address, network }: ContractOpts) {
    return SynthetixSynthToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
