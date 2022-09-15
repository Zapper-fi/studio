import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { TarotContractFactory, TarotSupplyVault } from '../contracts';
import { TAROT_DEFINITION } from '../tarot.definition';

type TarotVaultDataProps = {
  liquidity: number;
};

@Injectable()
export class FantomTarotVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  TarotSupplyVault,
  TarotVaultDataProps
> {
  appId = TAROT_DEFINITION.id;
  groupId = TAROT_DEFINITION.groups.vault.id;
  network = Network.FANTOM_OPERA_MAINNET;
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

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<TarotSupplyVault>) {
    return contract.underlying();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<TarotSupplyVault>) {
    const [underlyingToken] = appToken.tokens;
    const reserveRaw = await contract.getTotalUnderlying();

    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return appToken.supply > 0 ? reserve / appToken.supply : 0;
  }

  async getDataProps({ appToken, contract }: GetDataPropsParams<TarotSupplyVault, TarotVaultDataProps>) {
    const [underlyingToken] = appToken.tokens;
    const reserveRaw = await contract.getTotalUnderlying();

    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    const liquidity = underlyingToken.price * reserve;
    return { liquidity };
  }
}
