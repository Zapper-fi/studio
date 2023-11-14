import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

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

import { RedactedCartelViemContractFactory } from '../contracts';
import { RedactedBondDepository } from '../contracts/viem';

@PositionTemplate()
export class EthereumRedactedCartelBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RedactedBondDepository> {
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RedactedCartelViemContractFactory) protected readonly contractFactory: RedactedCartelViemContractFactory,
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
    const [principle, claimable] = await Promise.all([contract.read.principal(), contract.read.BTRFLY()]);

    return [
      {
        metaType: MetaType.VESTING,
        address: claimable,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: claimable,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: principle,
        network: this.network,
      },
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
      multicall.wrap(contract).read.bondInfo([address]),
      multicall.wrap(contract).read.pendingPayoutFor([address]),
    ]);

    return [BigNumber.from(bondInfo[0]).sub(claimablePayout).toString(), claimablePayout.toString()];
  }
}
