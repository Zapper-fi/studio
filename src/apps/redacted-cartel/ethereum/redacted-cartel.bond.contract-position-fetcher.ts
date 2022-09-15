import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { RedactedBondDepository, RedactedCartelContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumRedactedCartelBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RedactedBondDepository> {
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RedactedCartelContractFactory) protected readonly contractFactory: RedactedCartelContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return [
      { address: '0x1fdf1233f85a3bae9594b0558e4ec8febe8c6720' },
      { address: '0xfd7bda47cbeeed93c897273585f666f8d1cc8d45' },
      { address: '0x737119790f6e0f85451ab200759f8efa144dcd43' },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.redactedBondDepository({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<RedactedBondDepository>) {
    const [principle, claimable] = await Promise.all([contract.principal(), contract.BTRFLY()]);

    return [
      { address: claimable, metaType: MetaType.VESTING },
      { address: claimable, metaType: MetaType.CLAIMABLE },
      { address: principle, metaType: MetaType.SUPPLIED },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<RedactedBondDepository>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<RedactedBondDepository>) {
    return getImagesFromToken(contractPosition.tokens[2]);
  }

  async getTokenBalancesPerPosition({ address, contract, multicall }: GetTokenBalancesParams<RedactedBondDepository>) {
    const [bondInfo, claimablePayout] = await Promise.all([
      multicall.wrap(contract).bondInfo(address),
      multicall.wrap(contract).pendingPayoutFor(address),
    ]);

    return [bondInfo.payout.sub(claimablePayout).toString(), claimablePayout.toString()];
  }
}
