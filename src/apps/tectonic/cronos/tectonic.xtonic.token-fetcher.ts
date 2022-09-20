import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { GetDataPropsParams } from '~position/template/app-token.template.types';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

import { TectonicContractFactory } from '../contracts';

@PositionTemplate()
export class CronosTectonicXTonicTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'xTONIC';

  vaultAddress = '0x1bc9b7d4be47b76965a3f8e910b9ddd83150840f';
  underlyingTokenAddress = '0xdd73dea10abc2bff99c60882ec5b2b81bb1dc5b2'; // Tonic

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(TectonicContractFactory) private readonly contractFactory: TectonicContractFactory,
  ) {
    super(appToolkit);
  }

  async getReserves({ multicall }: GetDataPropsParams<Erc20>) {
    const tonic = this.contractFactory.tectonicTToken({ address: this.underlyingTokenAddress, network: this.network });

    const [stakedTonic, decimals] = await Promise.all([
      multicall.wrap(tonic).balanceOf('0xe165132fda537fa89ca1b52a647240c2b84c8f89'), // staking pool address
      multicall.wrap(tonic).decimals(),
    ]);

    return [Number(stakedTonic) / 10 ** decimals];
  }
}
