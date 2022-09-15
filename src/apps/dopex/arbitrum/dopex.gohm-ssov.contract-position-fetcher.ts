import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { DopexSsovContractPositionFetcher, DopexSsovDataProps } from '../common/dopex.ssov.contract-position-fetcher';
import { DopexGOhmSsov } from '../contracts';

@PositionTemplate()
export class ArbitrumDopexGOhmSsovContractPositionFetcher extends DopexSsovContractPositionFetcher<DopexGOhmSsov> {
  groupLabel = 'SSOVs';

  getContract(address: string): DopexGOhmSsov {
    return this.contractFactory.dopexGOhmSsov({ address, network: this.network });
  }

  getSsovDefinitions() {
    return [
      // gOHM December Epoch (Legacy)
      {
        address: '0x89836d5f178141aaf013412b12abd754802d2318',
        depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
      },
      // gOHM January Epoch (Legacy)
      {
        address: '0x460f95323a32e26c8d32346abe73eb94d7db08d6',
        depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
      },
      // gOHM February Epoch (Active)
      {
        address: '0x54552cb564f4675bceda644e47de3e35d1c88e1b',
        depositTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1',
      },
    ];
  }

  getTotalEpochStrikeDepositBalance({
    contract,
    contractPosition,
  }: GetTokenBalancesParams<DopexGOhmSsov, DopexSsovDataProps>) {
    const { epoch, strike } = contractPosition.dataProps;
    return contract.totalEpochStrikeGohmBalance(epoch, strike);
  }

  async getTotalEpochStrikeRewardBalances(_params: GetTokenBalancesParams<DopexGOhmSsov, DopexSsovDataProps>) {
    return [];
  }
}
