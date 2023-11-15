import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { ethers, BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { YieldYakViemContractFactory } from '../contracts';
import { YieldYakVault } from '../contracts/viem';

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
    @Inject(YieldYakViemContractFactory) private readonly contractFactory: YieldYakViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.yieldYakVault({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const farms = await Axios.get<YieldYakFarmDetails[]>('https://staging-api.yieldyak.com/farms').then(x => x.data);
    return farms.map(farm => farm.address.toLowerCase());
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<YieldYakVault>) {
    return [{ address: await contract.read.depositToken(), network: this.network }];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<YieldYakVault>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getPricePerShare(_params: GetPricePerShareParams<YieldYakVault>) {
    const one_receipt_token = BigNumber.from(10).pow(_params.appToken.decimals);
    try {
      const depositToken = await _params.contract.read.depositToken();
      const depositTokenDecimals = await this.getDecimals({
        ..._params,
        address: depositToken,
        multicall: _params.multicall,
      });

      const underlying = await _params.contract.read.getDepositTokensForShares([BigInt(one_receipt_token.toString())]);
      const pps = ethers.utils.formatUnits(underlying, depositTokenDecimals);
      return [+pps];
    } catch (err) {
      return [1];
    }
  }
}
