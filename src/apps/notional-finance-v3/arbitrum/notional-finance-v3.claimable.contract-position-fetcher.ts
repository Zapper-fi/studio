import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { NotionalFinanceV3ViemContractFactory } from '../contracts';
import { NotionalView } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumNotionalFinanceV3ClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<NotionalView> {
  groupLabel = 'Claimable';

  notionalViewContractAddress = '0x1344a36a1b56144c3bc62e7757377d288fde0369';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(NotionalFinanceV3ViemContractFactory)
    protected readonly contractFactory: NotionalFinanceV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.notionalView({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.notionalViewContractAddress }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.CLAIMABLE, address: '0x019be259bc299f3f653688c7655c87f998bc7bc1', network: this.network },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<NotionalView>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<NotionalView>) {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const block = await provider.getBlockNumber();

    const claimable = await contract.read.nTokenGetClaimableIncentives([address, BigInt(block)]);

    return [claimable];
  }
}
