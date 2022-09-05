import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BARNBRIDGE_SMART_ALPHA_DEFINITION = appDefinition({
  id: 'barnbridge-smart-alpha',
  name: 'Barnbridge Smart Alpha',
  description: `A fluctuations derivatives protocol for hedging yield sensitivity and market price.`,
  groups: {
    juniorPool: { id: 'junior-pool', type: GroupType.TOKEN, label: 'Junior Pool' },
    seniorPool: { id: 'senior-pool', type: GroupType.TOKEN, label: 'Senior Pool' },
  },
  url: 'https://barnbridge.com/',
  links: {
    github: 'https://github.com/BarnBridge/',
    twitter: 'https://twitter.com/barn_bridge',
    telegram: 'https://discord.com/invite/FfEhsVk',
    medium: 'https://medium.com/barnbridge',
  },
  tags: [AppTag.TOKENIZED_RISK],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(BARNBRIDGE_SMART_ALPHA_DEFINITION.id)
export class BarnbridgeSmartAlphaAppDefinition extends AppDefinition {
  constructor() {
    super(BARNBRIDGE_SMART_ALPHA_DEFINITION);
  }
}

export default BARNBRIDGE_SMART_ALPHA_DEFINITION;
