import { Inject } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { MorphoContractFactory } from '../contracts';

export type EthereumMorphoPositionPresenterDataProps = { healthFactor: number };
@PresenterTemplate()
export class EthereumMorphoPositionPresenter extends PositionPresenterTemplate<EthereumMorphoPositionPresenterDataProps> {
  morphoCompoundLensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
  morphoAaveLensAddress = '0x507fa343d0a90786d86c7cd885f5c49263a91ff4';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) protected readonly contractFactory: MorphoContractFactory,
  ) {
    super();
  }

  override async dataProps(address: string): Promise<EthereumMorphoPositionPresenterDataProps | undefined> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const lens = this.contractFactory.morphoAaveV2Lens({
      address: this.morphoAaveLensAddress,
      network: this.network,
    });
    const healthFactor = await multicall
      .wrap(lens)
      .getUserHealthFactor(address)
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return;
        throw err;
      });

    if (!healthFactor) return;
    return { healthFactor: +formatUnits(healthFactor) };
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    _balances: ReadonlyBalances,
    dataProps?: EthereumMorphoPositionPresenterDataProps,
  ): MetadataItemWithLabel[] {
    if (groupLabel === 'Morpho Aave') {
      if (!dataProps) return [];

      const { healthFactor } = dataProps;

      return [
        {
          label: 'Health Factor',
          value: healthFactor,
          type: 'number',
        },
      ];
    }
    return [];
  }
}
