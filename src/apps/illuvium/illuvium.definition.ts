import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ILLUVIUM_DEFINITION: AppDefinitionObject = {
  id: 'illuvium',
  name: 'Illuvium',
  description: `Illuvium is a collectible NFT RPG game and auto-battler rolled into one. There is an open-world RPG experience in the overworld, where you mine, harvest, capture, and fight Illuvials.`,
  url: 'https://www.illuvium.io/',
  links: {
    github: 'https://github.com/illuviumgame',
    twitter: 'https://twitter.com/illuviumio',
    discord: 'https://discord.com/invite/illuvium',
    telegram: 'https://t.me/illuvium',
    medium: 'https://medium.com/illuvium',
  },
  tags: [ProtocolTag.GAMING],
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
    farmV2: { id: 'farm-v2', type: GroupType.POSITION },
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
};

@Register.AppDefinition(ILLUVIUM_DEFINITION.id)
export class IlluviumAppDefinition extends AppDefinition {
  constructor() {
    super(ILLUVIUM_DEFINITION);
  }
}
