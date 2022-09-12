import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundSupplyTokenFetcher } from '~apps/compound/common/compound.supply.token-fetcher';
import { Network } from '~types/network.interface';

import { TectonicContractFactory, TectonicCore, TectonicTToken } from '../contracts';
import { TECTONIC_DEFINITION } from '../tectonic.definition';

@Injectable()
export class CronosTectonicSupplyTokenFetcher extends CompoundSupplyTokenFetcher<TectonicTToken, TectonicCore> {
  appId = TECTONIC_DEFINITION.id;
  groupId = TECTONIC_DEFINITION.groups.supply.id;
  network = Network.CRONOS_MAINNET;
  groupLabel = 'Lending';
  comptrollerAddress = '0xb3831584acb95ed9ccb0c11f677b5ad01deaeec0';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TectonicContractFactory) protected readonly contractFactory: TectonicContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.tectonicTToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.tectonicCore({ address, network: this.network });
  }

  getMarkets(contract: TectonicCore) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress(contract: TectonicTToken) {
    return contract.underlying();
  }

  getExchangeRate(contract: TectonicTToken) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getSupplyRate(contract: TectonicTToken) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }
}
