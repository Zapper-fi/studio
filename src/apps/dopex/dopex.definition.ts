import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DOPEX_DEFINITION = appDefinition({
  id: 'dopex',
  name: 'Dopex',
  description: `Dopex is a maximum liquidity and minimal exposure options protocol`,
  url: 'https://dopex.io/',

  groups: {
    farm: { id: 'farm', type: GroupType.POSITION, label: 'Staking', groupLabel: 'Farms' },
    dpxSsov: { id: 'dpx-ssov', type: GroupType.POSITION, label: 'SSOVs' },
    rdpxSsov: { id: 'rdpx-ssov', type: GroupType.POSITION, label: 'SSOVs' },
    ethSsov: { id: 'eth-ssov', type: GroupType.POSITION, label: 'SSOVs' },
    gohmSsov: { id: 'gohm-ssov', type: GroupType.POSITION, label: 'SSOVs' },
    gmxSsov: { id: 'gmx-ssov', type: GroupType.POSITION, label: 'SSOVs' },
    votingEscrow: { id: 'voting-escrow', type: GroupType.POSITION, label: 'Voting Escrow' },
  },
  links: {
    twitter: 'https://twitter.com/dopex_io',
    discord: 'https://discord.com/invite/dopex',
    github: 'https://github.com/dopex-io',
  },
  tags: [AppTag.OPTIONS],
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(DOPEX_DEFINITION.id)
export class DopexAppDefinition extends AppDefinition {
  constructor() {
    super(DOPEX_DEFINITION);
  }
}
