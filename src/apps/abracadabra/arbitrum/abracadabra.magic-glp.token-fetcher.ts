import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { GetDisplayPropsParams, UnderlyingTokenDefinition } from '~position/template/app-token.template.types';
import { Erc4626VaultTemplateTokenFetcher } from '~position/template/erc4626-vault.template.token-fetcher';

import { MAGIC_GLP_ADDRESS } from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraMagicGlpTokenFetcher extends Erc4626VaultTemplateTokenFetcher {
  groupLabel = 'Magic GLP';
  vaultAddress = MAGIC_GLP_ADDRESS;

  // Override as the underlying is sGLP, but users expect to see GLP
  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    const glpTokenDefinitions = await this.appToolkit.getAppTokenPositionsFromDatabase({
      appId: 'gmx',
      groupIds: ['glp'],
      network: this.network,
    });

    const glpUnderlying = glpTokenDefinitions[0];

    return [{ address: glpUnderlying.address, network: this.network }];
  }

  async getLabel({ contract }: GetDisplayPropsParams<Erc20>): Promise<string> {
    return contract.name();
  }
}
