import { Inject } from '@nestjs/common';
import { ethers, BigNumber } from 'ethers';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { YieldYakContractFactory, YieldYakVault } from '../contracts';

export type YieldYakFarmDetails = {
  address: string;
  deployed: number;
  name: string;
  depositToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  totalDeposits: string;
};

@PositionTemplate()
export class AvalancheYieldyakVaultTokenFetcher extends AppTokenTemplatePositionFetcher<YieldYakVault> {
  groupLabel = 'Vaults';
  minLiquidity = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldYakContractFactory) private readonly contractFactory: YieldYakContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YieldYakVault {
    return this.contractFactory.yieldYakVault({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const farms = await Axios.get<YieldYakFarmDetails[]>('https://staging-api.yieldyak.com/farms').then(x => x.data);
    return farms.map(farm => farm.address.toLowerCase());
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<YieldYakVault>) {
    return contract.depositToken().then(addr => addr.toLowerCase());
  }

  async getLabel({ appToken }: GetDisplayPropsParams<YieldYakVault>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getLiquidity({ appToken }: GetDataPropsParams<YieldYakVault>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<YieldYakVault>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }

  async getPricePerShare(_params: GetPricePerShareParams<YieldYakVault>): Promise<number | number[]> {
    const one_receipt_token = BigNumber.from(10).pow(_params.appToken.decimals);
    try {
      const underlying = await _params.contract.getDepositTokensForShares(one_receipt_token);
      const pps = ethers.utils.formatUnits(underlying, _params.appToken.decimals);
      return +pps;
    } catch (err) {
      return 1;
    }
  }
}
