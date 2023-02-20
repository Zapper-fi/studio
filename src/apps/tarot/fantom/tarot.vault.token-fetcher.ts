import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { TarotContractFactory, TarotSupplyVault } from '../contracts';

@PositionTemplate()
export class FantomTarotVaultTokenFetcher extends AppTokenTemplatePositionFetcher<TarotSupplyVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(TarotContractFactory) private readonly contractFactory: TarotContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TarotSupplyVault {
    return this.contractFactory.tarotSupplyVault({ address, network: this.network });
  }

  async getAddresses() {
    return [
      '0x74d1d2a851e339b8cb953716445be7e8abdf92f4', // xTAROT
      '0x0defef0c977809db8c1a3f13fd8dacbd565d968e', // tFTM
      '0x68d211bc1e66814575d89bbe4f352b4cdbdacdfb', // tUSDC
      '0x87d05774362ff39af4944f949a34399baeb64a35', // tUSDC (Paused)
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<TarotSupplyVault>) {
    return [{ address: await contract.underlying(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<TarotSupplyVault>) {
    const [underlyingToken] = appToken.tokens;
    const reserveRaw = await contract.getTotalUnderlying();

    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    const pricePerShare = appToken.supply > 0 ? reserve / appToken.supply : 0;
    return [pricePerShare];
  }

  async getLiquidity({ contract, appToken }: GetDataPropsParams<TarotSupplyVault>) {
    const reserveRaw = await contract.getTotalUnderlying();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = appToken.tokens[0].price * reserve;
    return liquidity;
  }

  async getReserves({ contract, appToken }: GetDataPropsParams<TarotSupplyVault>) {
    const reserveRaw = await contract.getTotalUnderlying();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }
}
