import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ILLUVIUM_DEFINITION = {
  id: 'illuvium',
  name: 'Illuvium',
  description: `Illuvium is a collectible NFT RPG game and auto-battler rolled into one. There is an open-world RPG experience in the overworld, where you mine, harvest, capture, and fight Illuvials.`,
  url: 'https://www.illuvium.io/',
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
