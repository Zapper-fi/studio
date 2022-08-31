import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { HectorNetworkBondDepository, HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.bond.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<HectorNetworkBondDepository> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return [
      { address: '0x4099eb0e82ffa0048e4bf037a9743ca05ec561d7' },
      { address: '0x6c9b3a47a28a39fea65e99d97895e717df1706d0' },
      { address: '0x5d05ef2654b9055895f21d7057095e2d7575f5a2' },
      { address: '0x3c57481f373be0196a26a7d0a8e29e8cedc63ba1' },
      { address: '0xa4e87a25bc9058e4ec193151558c3c5d02cebe31' },
      { address: '0xde02631d898acd1bb8ff928c0f0ffa0cf29ab374' },
      { address: '0xa695750b8439ab2afbd88310946c99747c5b3a2e' },
      { address: '0x72de9f0e51ca520379a341318870836fdcaf03b9' },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.hectorNetworkBondDepository({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<HectorNetworkBondDepository>) {
    const [principle, claimable] = await Promise.all([contract.principle(), contract.HEC()]);

    return [
      { address: claimable, metaType: MetaType.VESTING },
      { address: claimable, metaType: MetaType.CLAIMABLE },
      { address: principle, metaType: MetaType.SUPPLIED },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<HectorNetworkBondDepository>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<HectorNetworkBondDepository>) {
    return getImagesFromToken(contractPosition.tokens[2]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<HectorNetworkBondDepository>) {
    const [bondInfo, claimablePayout] = await Promise.all([
      contract.bondInfo(address),
      contract.pendingPayoutFor(address),
    ]);

    return [bondInfo.payout.sub(claimablePayout).toString(), claimablePayout.toString()];
  }
}
