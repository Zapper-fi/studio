import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  OlympusBoostedLiquidityManager__factory,
  OlympusLiquidityRegistry__factory,
  OlympusV1BondDepository__factory,
  OlympusV2BondDepository__factory,
  OlympusZapperZap__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class OlympusViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  olympusBoostedLiquidityManager({ address, network }: ContractOpts) {
    return OlympusBoostedLiquidityManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  olympusLiquidityRegistry({ address, network }: ContractOpts) {
    return OlympusLiquidityRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  olympusV1BondDepository({ address, network }: ContractOpts) {
    return OlympusV1BondDepository__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  olympusV2BondDepository({ address, network }: ContractOpts) {
    return OlympusV2BondDepository__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  olympusZapperZap({ address, network }: ContractOpts) {
    return OlympusZapperZap__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
