import { Inject, Injectable } from '@nestjs/common';

import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { NereusFinanceContractFactory } from '../contracts';

type NereusFinanceGetHealthFactorParams = {
  address: string;
  network: Network;
  lendingPoolAddress: string;
};

@Injectable()
export class NereusFinanceHealthFactorMetaHelper {
  constructor(@Inject(NereusFinanceContractFactory) private readonly contractFactory: NereusFinanceContractFactory) {}

  async getHealthFactor({
    address,
    network,
    lendingPoolAddress,
  }: NereusFinanceGetHealthFactorParams): Promise<MetadataItemWithLabel> {
    const contractFactory = this.contractFactory;
    const lendingPoolContract = contractFactory.nereusFinanceLendingPoolProvider({
      network,
      address: lendingPoolAddress,
    });
    const lendingPoolUserData = await lendingPoolContract.getUserAccountData(address);
    const { healthFactor } = lendingPoolUserData;

    return {
      label: 'Health Factor',
      value: Number(healthFactor) / 10 ** 18,
      type: 'number',
    };
  }
}
