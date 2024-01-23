import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { LooksRareViemContractFactory } from '../contracts';
import { LooksRareCompounder } from '../contracts/viem';

@PositionTemplate()
export class EthereumLooksRareCompounderContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LooksRareCompounder> {
  groupLabel = 'Compounder';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LooksRareViemContractFactory) protected readonly contractFactory: LooksRareViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.looksRareCompounder({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x3ab16af1315dc6c95f83cbf522fecf98d00fd9ba' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<LooksRareCompounder>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.looksRareToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LooksRareCompounder>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<LooksRareCompounder>) {
    const [shareBalanceRaw, pricePerShareRaw] = await Promise.all([
      contract.read.userInfo([address]),
      contract.read.calculateSharePriceInLOOKS(),
    ]);

    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    const balanceRaw = new BigNumber(shareBalanceRaw.toString()).times(pricePerShare).toFixed(0);

    return [balanceRaw];
  }
}
