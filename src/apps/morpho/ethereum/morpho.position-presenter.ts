import { Inject } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { MorphoAaveV2Lens, MorphoCompoundLens, MorphoContractFactory } from '../contracts';

export type EthereumMorphoPositionPresenterDataProps = { healthFactorMA2: number; healthFactorMC: number };
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
    const aaveV2Lens = multicall.wrap(
      this.contractFactory.morphoAaveV2Lens({
        address: this.morphoAaveLensAddress,
        network: this.network,
      }),
    ) as MorphoAaveV2Lens;
    const compoundLens = multicall.wrap(
      this.contractFactory.morphoCompoundLens({
        address: this.morphoCompoundLensAddress,
        network: this.network,
      }),
    ) as MorphoCompoundLens;

    const [healthFactorMA2, healthFactorMC] = await Promise.all([
      aaveV2Lens.getUserHealthFactor(address).catch(err => {
        if (isMulticallUnderlyingError(err)) return;
        throw err;
      }),
      compoundLens.getUserHealthFactor(address, []).catch(err => {
        if (isMulticallUnderlyingError(err)) return;
        throw err;
      }),
    ]);

    if (!healthFactorMA2 || !healthFactorMC) return;
    return { healthFactorMA2: +formatUnits(healthFactorMA2), healthFactorMC: +formatUnits(healthFactorMC) };
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    _balances: ReadonlyBalances,
    dataProps?: EthereumMorphoPositionPresenterDataProps,
  ): MetadataItemWithLabel[] {
    if (!dataProps) return [];
    const format = (hf: number) =>
      [
        {
          label: 'Health Factor',
          value: hf,
          type: 'number',
        },
      ] as MetadataItemWithLabel[];
    switch (groupLabel) {
      case 'Morpho Compound':
        return format(dataProps.healthFactorMC);
      case 'Morpho Aave':
        return format(dataProps.healthFactorMA2);
      default:
        return [];
    }
  }
}
