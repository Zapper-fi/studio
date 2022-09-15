import { Inject, Injectable } from '@nestjs/common';
import _, { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { GetDefinitionsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { TarotBorrowable, TarotContractFactory } from '../contracts';
import { TAROT_DEFINITION } from '../tarot.definition';

@Injectable()
export class FantomTarotBorrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TarotBorrowable> {
  appId = TAROT_DEFINITION.id;
  groupId = TAROT_DEFINITION.groups.borrow.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending Pools';

  private tarotFactoryAddresses = [
    '0x35c052bbf8338b06351782a565aa9aad173432ea', // Tarot Classic
    '0xf6d943c8904195d0f69ba03d97c0baf5bbdcd01b', // Tarot Requiem
    '0xbf76f858b42bb9b196a87e43235c2f0058cf7322', // Tarot Carcosa
  ];

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(TarotContractFactory) private readonly contractFactory: TarotContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TarotBorrowable {
    return this.contractFactory.tarotBorrowable({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const addresses = await Promise.all(
      this.tarotFactoryAddresses.map(async tarotFactoryAddress => {
        const tarotFactory = multicall.wrap(
          this.contractFactory.tarotFactory({ address: tarotFactoryAddress, network: this.network }),
        );

        const numPoolsRaw = await tarotFactory.allLendingPoolsLength();

        return Promise.all(
          _.range(0, Number(numPoolsRaw)).map(async index => {
            const tarotVaultAddressRaw = await tarotFactory.allLendingPools(index);
            const tarotVaultAddress = tarotVaultAddressRaw.toLowerCase();

            const tarotVault = this.contractFactory.tarotVault({ network: this.network, address: tarotVaultAddress });
            const isVault = await multicall
              .wrap(tarotVault)
              .isVaultToken()
              .catch(() => false);
            if (!isVault) return null;

            const { borrowable0, borrowable1 } = await tarotFactory.getLendingPool(tarotVaultAddress);
            return [borrowable0, borrowable1];
          }),
        );
      }),
    ).then(addresses => addresses.flat().flat());

    return compact(addresses).map(address => ({
      address,
    }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<TarotBorrowable>) {
    const underlyingAddress = await contract.underlying();
    return [{ address: underlyingAddress, metaType: MetaType.BORROWED }];
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
    const balanceRaw = await contract.borrowBalance(address);
    return [balanceRaw];
  }
}
