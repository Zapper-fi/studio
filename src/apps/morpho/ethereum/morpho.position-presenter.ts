import { Inject } from '@nestjs/common';
import { BigNumber, constants } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';

import { MorphoViemContractFactory } from '../contracts';

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
    @Inject(MorphoViemContractFactory) protected readonly contractFactory: MorphoViemContractFactory,
  ) {
    super();
  }

  override async dataProps(address: string): Promise<EthereumMorphoPositionPresenterDataProps | undefined> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const aaveV2Lens = multicall.wrap(
      this.contractFactory.morphoAaveV2Lens({
        address: this.morphoAaveLensAddress,
        network: this.network,
      }),
    );

    const compoundLens = multicall.wrap(
      this.contractFactory.morphoCompoundLens({
        address: this.morphoCompoundLensAddress,
        network: this.network,
      }),
    );

    const morphoAaveV3 = multicall.wrap(
      this.contractFactory.morphoAaveV3({
        address: this.morphoAaveV3Address,
        network: this.network,
      }),
    );

    const [healthFactorMA2Raw, healthFactorMCRaw, liquidityDataMA3Raw] = await Promise.all([
      aaveV2Lens.read.getUserHealthFactor([address]),
      compoundLens.read.getUserHealthFactor([address, []]),
      morphoAaveV3.read.liquidityData([address]),
    ]);

    const maxDebtMA3 = BigNumber.from(liquidityDataMA3Raw.maxDebt);
    const debtMA3 = BigNumber.from(liquidityDataMA3Raw.debt);
    const unit = parseUnits('1');

    const healthFactorMA2 = +formatUnits(BigNumber.from(healthFactorMA2Raw));
    const healthFactorMC = +formatUnits(BigNumber.from(healthFactorMCRaw));
    const healthFactorMA3 = +formatUnits(debtMA3.eq(0) ? constants.MaxInt256 : maxDebtMA3.mul(unit).div(debtMA3));

    return { healthFactorMA2, healthFactorMC, healthFactorMA3 };
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
