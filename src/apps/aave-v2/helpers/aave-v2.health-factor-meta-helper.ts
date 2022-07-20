import { Inject, Injectable } from '@nestjs/common';

import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AaveV2ContractFactory } from '../contracts';

type AaveV2GetHealthFactorParams = {
  address: string;
  network: Network;
  lendingPoolAddress: string;
};

@Injectable()
export class AaveV2HealthFactorMetaHelper {
  constructor(@Inject(AaveV2ContractFactory) private readonly contractFactory: AaveV2ContractFactory) {}

  async getHealthFactor({
    address,
    network,
    lendingPoolAddress,
  }: AaveV2GetHealthFactorParams): Promise<MetadataItemWithLabel> {
    const contractFactory = this.contractFactory;
    const lendingPoolContract = contractFactory.aaveV2LendingPoolProvider({ network, address: lendingPoolAddress });
    const lendingPoolUserData = await lendingPoolContract.getUserAccountData(address);
    const { healthFactor } = lendingPoolUserData;

    return {
      label: 'Health Factor',
      value: Number(healthFactor) / 10 ** 18,
      type: 'number',
    };
  }
}
