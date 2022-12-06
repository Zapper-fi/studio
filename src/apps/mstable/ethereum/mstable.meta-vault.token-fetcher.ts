import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { MstableContractFactory } from '../contracts';
import { MstableMetavault4626 } from '../contracts/ethers';

@PositionTemplate()
export class EthereumMstableMetaVaultTokenFetcher extends AppTokenTemplatePositionFetcher<MstableMetavault4626> {
  groupLabel = 'Meta Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableContractFactory) protected readonly contractFactory: MstableContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MstableMetavault4626 {
    return this.contractFactory.mstableMetavault4626({ address, network: this.network });
  }

  async getAddresses() {
    return [
      '0x455fb969dc06c4aa77e7db3f0686cc05164436d2', // Convex 3Pool Meta Vault
    ];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<MstableMetavault4626>) {
    return contract.asset();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<MstableMetavault4626>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }
}
