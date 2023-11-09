import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  DefaultAppTokenDefinition,
  GetPricePerShareParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { TempusViemContractFactory } from '../contracts';
import { TempusAmm } from '../contracts/viem';

import { getTempusData } from './tempus.datasource';

export abstract class TempusAmmTokenFetcher extends AppTokenTemplatePositionFetcher<TempusAmm> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TempusViemContractFactory) protected readonly contractFactory: TempusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.tempusAmm({ address, network: this.network });
  }

  async getAddresses() {
    const data = await getTempusData(this.network);
    return data.tempusPools.map(v => v.ammAddress.toLowerCase());
  }

  async getUnderlyingTokenDefinitions({
    contract,
    multicall,
  }: GetUnderlyingTokensParams<TempusAmm, DefaultAppTokenDefinition>) {
    const poolAddress = await contract.read.tempusPool();
    const pool = multicall.wrap(this.contractFactory.tempusPool({ address: poolAddress, network: this.network }));

    return [
      { address: await pool.read.principalShare(), network: this.network },
      { address: await pool.read.yieldShare(), network: this.network },
    ];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<TempusAmm>) {
    const totalSupply = await contract.read.totalSupply();
    const reservesRaw = await contract.read.getExpectedTokensOutGivenBPTIn([totalSupply]);
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** appToken.tokens[i].decimals);
    return reserves.map(r => r / appToken.supply);
  }

  async getLabel({ appToken }: GetDisplayPropsParams<TempusAmm>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<TempusAmm>) {
    const reservesUSD = appToken.tokens.map((t, i) => appToken.dataProps.reserves[i] * t.price);
    const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
    const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);
    const ratio = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');

    return ratio;
  }
}
