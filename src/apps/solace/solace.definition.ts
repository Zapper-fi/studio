import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SOLACE_DEFINITION = appDefinition({
  id: 'solace',
  name: 'solace',
  description:
    'Solace is an insurance protocol that is aiming to invent the future of DeFi Insurance. The protocol helps you to protect your funds against smart-contracts exploits across 180+ protocols with an intelligent single policy that automatically adjusts coverage to changes in your positions.',
  url: 'https://solace.fi',
  groups: {
    scp: { id: 'scp', type: GroupType.TOKEN, label: 'SCP'},
    xsolacev1: { id: 'xsolacev1', type: GroupType.TOKEN, label: 'xSOLACEv1'},
    bonds: { id: 'bonds', type: GroupType.POSITION, label: 'Bonds'},
    xslocker: { id: 'xslocker', type: GroupType.POSITION, label: 'xsLocker'},
    policies: { id: 'policies', type: GroupType.POSITION, label: 'Policies'},
  },
  tags: [AppTag.INSURANCE],
  keywords: [],
  links: {
    learn: '',
    github: 'https://github.com/solace-fi',
    twitter: 'https://twitter.com/SolaceFi/',
    telegram: '',
    discord: 'https://discord.com/invite/7v8qsyepfu/',
    medium: 'https://medium.com/solace-fi/',
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(SOLACE_DEFINITION.id)
export class SolaceAppDefinition extends AppDefinition {
  constructor() {
    super(SOLACE_DEFINITION);
  }
}

export default SOLACE_DEFINITION;
