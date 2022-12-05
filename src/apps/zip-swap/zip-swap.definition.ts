import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppTag } from '~app/app.interface';

export const ZIP_SWAP_DEFINITION = appDefinition({
  id: 'zip-swap',
  name: 'ZipSwap',
  description: `Lowest fee swaps on optimistic rollups`,
  url: 'https://zipswap.fi/',
  links: {
    twitter: 'https://twitter.com/zip_swap',
    discord: 'http://discord.gg/F7GKncc5TB',
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
});

@Register.AppDefinition(ZIP_SWAP_DEFINITION.id)
export class ZipSwapAppDefinition extends AppDefinition {
  constructor() {
    super(ZIP_SWAP_DEFINITION);
  }
}
