import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { PlutusViemContractFactory } from '../contracts';
import { PlutusPrivateTgeVester } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumPlutusTgeClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PlutusPrivateTgeVester> {
  groupLabel = 'Private TGE Allocation';
  isExcludedFromExplore = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusViemContractFactory) protected readonly contractFactory: PlutusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.plutusPrivateTgeVester({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x04b724389dd28ffc9a3a91ab4149a77530282f04' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<PlutusPrivateTgeVester>) {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x51318b7d00db7acc4026c88c3952b66278b6a67f',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PlutusPrivateTgeVester>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PlutusPrivateTgeVester>) {
    const pendingClaims = await contract.read.pendingClaims([address]);
    return [BigNumber.from(pendingClaims[2]).sub(pendingClaims[1])];
  }
}
