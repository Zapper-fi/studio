import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { PlutusContractFactory, PlutusPrivateTgeVester } from '../contracts';
import PLUTUS_DEFINITION from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.tgeClaimable.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusTgeClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PlutusPrivateTgeVester> {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.tgeClaimable.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Private TGE Allocation';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusPrivateTgeVester {
    return this.contractFactory.plutusPrivateTgeVester({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x04b724389dd28ffc9a3a91ab4149a77530282f04' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<PlutusPrivateTgeVester>) {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x51318b7d00db7acc4026c88c3952b66278b6a67f' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PlutusPrivateTgeVester>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PlutusPrivateTgeVester>) {
    const pendingClaims = await contract.pendingClaims(address);
    return [pendingClaims._claimable];
  }
}
