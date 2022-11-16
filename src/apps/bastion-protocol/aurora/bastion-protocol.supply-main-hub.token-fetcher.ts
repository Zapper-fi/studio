import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolComptroller, BastionProtocolContractFactory, BastionProtocolCtoken } from '../contracts';

@Injectable()
export class AuroraBastionProtocolSupplyMainHubTokenFetcher extends CompoundSupplyTokenFetcher<
  BastionProtocolCtoken,
  BastionProtocolComptroller
> {
  appId = BASTION_PROTOCOL_DEFINITION.id;
  groupId = BASTION_PROTOCOL_DEFINITION.groups.supplyMainHub.id;
  network = Network.AURORA_MAINNET;
  groupLabel = 'Main Hub Realm';
  comptrollerAddress = '0x6de54724e128274520606f038591a00c5e94a1f6';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BastionProtocolContractFactory) protected readonly contractFactory: BastionProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string): BastionProtocolCtoken {
    return this.contractFactory.bastionProtocolCtoken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.bastionProtocolComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<BastionProtocolComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<BastionProtocolCtoken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<BastionProtocolCtoken>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<BastionProtocolCtoken>) {
    return contract.supplyRatePerBlock();
  }
}
