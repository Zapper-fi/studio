import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';
import { Erc4626VaultTemplateTokenFetcher } from '~position/template/erc4626-vault.template.token-fetcher';

@PositionTemplate()
export class EthereumAbracadabraMagicApeTokenFetcher extends Erc4626VaultTemplateTokenFetcher {
  groupLabel = 'Magic APE';
  vaultAddress = '0xf35b31b941d94b249eaded041db1b05b7097feb6';

  async getLabel({ contract }: GetDisplayPropsParams<Erc20>): Promise<string> {
    return contract.name();
  }
}
