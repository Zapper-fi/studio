import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { MstableViemContractFactory } from '../contracts';
import { MstableMetavault4626 } from '../contracts/viem';

@PositionTemplate()
export class EthereumMstableMetaVaultTokenFetcher extends AppTokenTemplatePositionFetcher<MstableMetavault4626> {
  groupLabel = 'Meta Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableViemContractFactory) protected readonly contractFactory: MstableViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.mstableMetavault4626({ address, network: this.network });
  }

  async getAddresses() {
    return [
      '0x455fb969dc06c4aa77e7db3f0686cc05164436d2', // Convex 3Pool Meta Vault
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MstableMetavault4626>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<MstableMetavault4626>) {
    const reserveRaw = await contract.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
