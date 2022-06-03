import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types';

export const LLAMA_AIRFORCE_DEFINITION = appDefinition({
  id: 'llama-airforce',
  name: 'Llama Airforce',
  description: `Are you a CVX locker, but unhappy due to high Ethereum gas costs, voting manually and/or not knowing what to vote for? Join The Union today! Sit back with a mojito in your hand and passively earn juicy bribe income!`,
  url: 'https://llama.airforce/',
  tags: [AppTag.YIELD_AGGREGATOR],

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Vaults',
    },

    airdrop: {
      id: 'airdrop',
      type: GroupType.TOKEN,
      label: 'Airdrop',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  links: {
    github: 'https://github.com/0xAlunara',
    twitter: 'https://twitter.com/0xAlunara',
  },

  primaryColor: '#f8f8f8',
});

@Register.AppDefinition(LLAMA_AIRFORCE_DEFINITION.id)
export class LlamaAirforceAppDefinition extends AppDefinition {
  constructor() {
    super(LLAMA_AIRFORCE_DEFINITION);
  }
}
