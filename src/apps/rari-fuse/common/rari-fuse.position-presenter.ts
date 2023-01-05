import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { lendingDataProps, LendingDataProps, presentLendingDataProps } from '~position/position-presenter.utils';
import { PositionDataPropsParams, PositionPresenterTemplate } from '~position/template/position-presenter.template';

export abstract class RariFusePositionPresenter extends PositionPresenterTemplate<LendingDataProps> {
  async positionDataProps({ balances }: PositionDataPropsParams): Promise<LendingDataProps | undefined> {
    return lendingDataProps(balances);
  }

  presentDataProps(dataProps: LendingDataProps): MetadataItemWithLabel[] {
    return presentLendingDataProps(dataProps);
  }
}
