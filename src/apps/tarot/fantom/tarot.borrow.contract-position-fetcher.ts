import { Inject } from '@nestjs/common';
import _, { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { TarotViemContractFactory } from '../contracts';
import { TarotBorrowable } from '../contracts/viem';

@PositionTemplate()
export class FantomTarotBorrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TarotBorrowable> {
  groupLabel = 'Lending Pools';

  private tarotFactoryAddresses = [
    '0x35c052bbf8338b06351782a565aa9aad173432ea', // Tarot Classic
    '0xf6d943c8904195d0f69ba03d97c0baf5bbdcd01b', // Tarot Requiem
    '0xbf76f858b42bb9b196a87e43235c2f0058cf7322', // Tarot Carcosa
  ];

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(TarotViemContractFactory) private readonly contractFactory: TarotViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.tarotBorrowable({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const addresses = await Promise.all(
      this.tarotFactoryAddresses.map(async tarotFactoryAddress => {
        const tarotFactory = multicall.wrap(
          this.contractFactory.tarotFactory({ address: tarotFactoryAddress, network: this.network }),
        );

        const numPoolsRaw = await tarotFactory.read.allLendingPoolsLength();

        return Promise.all(
          _.range(0, Number(numPoolsRaw)).map(async index => {
            const tarotVaultAddressRaw = await tarotFactory.read.allLendingPools([BigInt(index)]);
            const tarotVaultAddress = tarotVaultAddressRaw.toLowerCase();

            const tarotVault = this.contractFactory.tarotVault({ network: this.network, address: tarotVaultAddress });
            const isVault = await multicall
              .wrap(tarotVault)
              .read.isVaultToken()
              .catch(() => false);
            if (!isVault) return null;

            const lendingPool = await tarotFactory.read.getLendingPool([tarotVaultAddress]);
            return [lendingPool[3], lendingPool[4]];
          }),
        );
      }),
    ).then(addresses => addresses.flat().flat());

    return compact(addresses).map(address => ({
      address,
    }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<TarotBorrowable>) {
    const underlyingAddress = await contract.read.underlying();
    return [
      {
        metaType: MetaType.BORROWED,
        address: underlyingAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<TarotBorrowable>): Promise<DisplayProps['label']> {
    const [underlyingToken] = contractPosition.tokens;
    return getLabelFromToken(underlyingToken);
  }

  async getSecondaryLabel({
    contractPosition,
  }: GetDisplayPropsParams<TarotBorrowable>): Promise<DisplayProps['secondaryLabel']> {
    const [underlyingToken] = contractPosition.tokens;
    return buildDollarDisplayItem(underlyingToken.price);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<TarotBorrowable>) {
    const balanceRaw = await contract.read.borrowBalance([address]);
    return [balanceRaw];
  }
}
