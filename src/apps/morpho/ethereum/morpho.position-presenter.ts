import { Inject } from '@nestjs/common';
import { constants } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { MorphoAaveV2Lens, MorphoAaveV3, MorphoCompoundLens, MorphoContractFactory } from '../contracts';

export type EthereumMorphoPositionPresenterDataProps = {
  healthFactorMA2: number;
  healthFactorMC: number;
  healthFactorMA3: number;
};
@PresenterTemplate()
export class EthereumMorphoPositionPresenter extends PositionPresenterTemplate<EthereumMorphoPositionPresenterDataProps> {
  morphoCompoundLensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
  morphoAaveLensAddress = '0x507fa343d0a90786d86c7cd885f5c49263a91ff4';
  morphoAaveV3Address = '0x33333aea097c193e66081e930c33020272b33333';

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

    const morphoAaveV3 = multicall.wrap(
      this.contractFactory.morphoAaveV3({
        address: this.morphoAaveV3Address,
        network: this.network,
      }),
    ) as MorphoAaveV3;

    const [healthFactorMA2, healthFactorMC, liquidityDataMA3] = await Promise.all([
      aaveV2Lens.getUserHealthFactor(address).catch(err => {
        if (isMulticallUnderlyingError(err)) return;
        throw err;
      }),
      compoundLens.getUserHealthFactor(address, []).catch(err => {
        if (isMulticallUnderlyingError(err)) return;
        throw err;
      }),
      morphoAaveV3.liquidityData(address).catch(err => {
        if (isMulticallUnderlyingError(err)) return;
        throw err;
      }),
    ]);

    if (!healthFactorMA2 || !healthFactorMC || !liquidityDataMA3) return;
    return {
      healthFactorMA2: +formatUnits(healthFactorMA2),
      healthFactorMC: +formatUnits(healthFactorMC),
      healthFactorMA3: +formatUnits(
        liquidityDataMA3.debt.isZero()
          ? constants.MaxInt256
          : liquidityDataMA3.maxDebt.mul(parseUnits('1')).div(liquidityDataMA3.debt),
      ),
    };
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
      case 'Morpho AaveV3':
        return format(dataProps.healthFactorMA3);
      default:
        return [];
    }
  }
}
