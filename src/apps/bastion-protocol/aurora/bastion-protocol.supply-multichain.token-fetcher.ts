// import { Inject } from '@nestjs/common';
// import { compact } from 'lodash';

// import { Register } from '~app-toolkit/decorators';
// import { PositionFetcher } from '~position/position-fetcher.interface';
// import { AppTokenPosition } from '~position/position.interface';
// import { Network } from '~types/network.interface';

// import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
// import { BastionSupplyTokenHelper } from '../helper/bastion-protocol.supply.token-helper';

// const appId = BASTION_PROTOCOL_DEFINITION.id;
// const groupId = BASTION_PROTOCOL_DEFINITION.groups.supplyMultichain.id;
// const network = Network.AURORA_MAINNET;

// @Register.TokenPositionFetcher({ appId, groupId, network })
// export class AuroraBastionProtocolSupplyMultichainTokenFetcher implements PositionFetcher<AppTokenPosition> {
//   constructor(@Inject(BastionSupplyTokenHelper) private readonly bastionSupplyTokenHelper: BastionSupplyTokenHelper) {}
//   async getPositions() {
//     const tokens = await this.bastionSupplyTokenHelper.getTokens({
//       comptrollerAddress: '0xa195b3d7aa34e47fb2d2e5a682df2d9efa2daf06',
//       realmName: 'Multichain Realm',
//       network,
//       appId,
//       groupId,
//     });

//     return compact(tokens);
//   }
// }

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
export class AuroraBastionProtocolSupplyMultichainTokenFetcher extends CompoundSupplyTokenFetcher<
  BastionProtocolCtoken,
  BastionProtocolComptroller
> {
  appId = BASTION_PROTOCOL_DEFINITION.id;
  groupId = BASTION_PROTOCOL_DEFINITION.groups.supplyMultichain.id;
  network = Network.AURORA_MAINNET;
  groupLabel = 'Multichain Realm';
  comptrollerAddress = '0xa195b3d7aa34e47fb2d2e5a682df2d9efa2daf06';

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
